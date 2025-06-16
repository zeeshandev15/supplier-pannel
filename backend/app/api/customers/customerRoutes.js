import express from 'express';

import {
  createCustomers,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from '../../../controllers/customerController.js';
import upload from '../../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), createCustomers);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', upload.single('image'), updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
