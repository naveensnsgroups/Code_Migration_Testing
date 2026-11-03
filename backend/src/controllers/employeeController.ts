import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Employee from '../models/Employee';

// Whitelisted fields — only these can be set via API
const ALLOWED_FIELDS = [
  'fullName', 'employeeId', 'email', 'phone',
  'dateOfBirth', 'gender', 'address',
  'department', 'position', 'joinDate',
];

/**
 * Pick only allowed fields from an object (prevents mass assignment)
 */
const pickFields = (body: any): Record<string, any> => {
  return ALLOWED_FIELDS.reduce((acc: Record<string, any>, key: string) => {
    if (body[key] !== undefined && body[key] !== null) {
      if (typeof body[key] === 'string') {
        const trimmed = body[key].trim();
        acc[key] = key === 'email' ? trimmed.toLowerCase() : trimmed;
      } else {
        acc[key] = body[key];
      }
    }
    return acc;
  }, {});
};

/**
 * Validate MongoDB ObjectId — returns false if invalid
 */
const isValidId = (id: string): boolean => mongoose.isValidObjectId(id);

// @desc    Get all employees
// @route   GET /api/employees
export const getAllEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page  = Math.max(1, parseInt(req.query.page as string)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 50);
    const skip  = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Employee.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
export const getEmployeeById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID format' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
export const createEmployee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const safeData = pickFields(req.body);
    const employee = await Employee.create(safeData);
    return res.status(201).json({ success: true, message: 'Employee created successfully', data: employee });
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
export const updateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID format' });
    }

    const safeData = pickFields(req.body);
    const employee = await Employee.findByIdAndUpdate(req.params.id, safeData, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.status(200).json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID format' });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};
