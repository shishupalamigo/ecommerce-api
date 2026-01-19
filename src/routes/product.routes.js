const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Public
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

// Admin only
router.post(
  '/',
  authenticate,
  authorize('admin'),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product list
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Product created
 */


module.exports = router;
