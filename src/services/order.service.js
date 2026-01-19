const mongoose = require('mongoose');
const orderRepo = require('../repositories/order.repo');
const cartRepo = require('../repositories/cart.repo');
const productRepo = require('../repositories/product.repo');


const placeOrder = async (userId) => {
    const session = await mongoose.startSession();

    const useTransaction = mongoose.connection.readyState === 1 &&
        mongoose.connection.client.topology?.description?.type === 'ReplicaSet';

    if (useTransaction) {
        session.startTransaction();
    }

    try {
        const cart = await cartRepo.findByUserId(userId);
        if (!cart || cart.items.length === 0) {
            const err = new Error('Cart is empty');
            err.statusCode = 400;
            throw err;
        }

        let total = 0;

        for (const item of cart.items) {
            const product = await productRepo.findById(item.productId);

            if (!product || product.stockQuantity < item.quantity) {
                throw new Error('Stock unavailable');
            }

            product.stockQuantity -= item.quantity;
            await product.save(useTransaction ? { session } : {});
            total += item.quantity * item.priceAtAddTime;
        }

        const orderItems = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.priceAtAddTime
        }));

        const order = await orderRepo.create({
            userId,
            items: orderItems,
            totalAmount: total,
        });


        await cartRepo.deleteCart(userId);

        if (useTransaction) {
            await session.commitTransaction();
        }

        return order;
    } catch (err) {
        if (useTransaction) {
            await session.abortTransaction();
        }
        throw err;
    } finally {
        session.endSession();
    }
};


const getOrders = async (userId) => {
    return orderRepo.findByUserId(userId);
};

module.exports = {
    placeOrder,
    getOrders,
};
