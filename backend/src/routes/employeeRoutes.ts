import { Router } from 'express';
import validateEmployeeWithZod from '../middleware/validateEmployee.js';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';

const router = Router();

router
  .route('/')
  .get(getAllEmployees)
  .post(validateEmployeeWithZod, createEmployee);

router
  .route('/:id')
  .get(getEmployeeById)
  .put(validateEmployeeWithZod, updateEmployee)
  .delete(deleteEmployee);

export default router;
