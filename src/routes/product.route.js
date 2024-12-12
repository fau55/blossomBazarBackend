import { Router } from "express";
import { addProduct, deleteProduct, editProduct, getAllProducts, getProductByProductId } from '../controllers/product.controller.js';

const router = Router();

router.route('/get-all').get(getAllProducts);
router.route('/add').post(addProduct);
router.route('/edit/:id').post(editProduct);
router.route('/delete/:id').delete(deleteProduct);
router.route('/get-product-by/:productId').get(getProductByProductId);

export default router;
