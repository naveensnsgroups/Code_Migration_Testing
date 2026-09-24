import { z } from 'zod';

export const employeeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .regex(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed (no numbers or special characters)'),

  employeeId: z
    .string()
    .trim()
    .min(1, 'Employee ID is required')
    .regex(/^EMP\d+$/, 'Must start with capital EMP followed by numbers (e.g. EMP001)'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .regex(/^[a-z0-9._%+-]+@snsgroups\.com$/, 'Must be a valid email ending with @snsgroups.com'),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),

  dateOfBirth: z.string().optional(),

  gender: z.enum(['Male', 'Female', 'Other', '']).optional(),

  address: z.string().trim().max(500, 'Address cannot exceed 500 characters').optional(),

  department: z
    .enum(['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Admin', 'Other', ''])
    .optional(),

  position: z.string().trim().max(100, 'Position cannot exceed 100 characters').optional(),

  joinDate: z.string().optional(),
});

/**
 * Validates object data using Zod schema.
 * @param {object} formData
 * @returns {{ isValid: boolean, errors: object, data: object|null }}
 */
export const validateWithZod = (formData) => {
  const result = employeeSchema.safeParse(formData);
  if (result.success) {
    return { isValid: true, errors: {}, data: result.data };
  }

  const errors = {};
  result.error.issues.forEach((issue) => {
    const fieldName = issue.path[0];
    if (fieldName && !errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  });

  return { isValid: false, errors, data: null };
};
