const { z } = require('zod');

// Empty strings from HTML form fields (e.g. an unselected <select>) mean "not provided"
const emptyToUndefined = (value) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

// Optional enum; '' is treated as not provided (matches the Mongoose model's enum values)
const optionalEnum = (values, label) =>
  z.preprocess(
    emptyToUndefined,
    z
      .enum(values, {
        errorMap: () => ({ message: `${label} must be one of: ${values.join(', ')}` }),
      })
      .optional()
      .nullable()
  );

const isRealDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

// Optional YYYY-MM-DD date; '' is treated as not provided
const optionalDate = (label, { notInFuture = false } = {}) =>
  z.preprocess(
    emptyToUndefined,
    z
      .string({ invalid_type_error: `${label} must be a date string` })
      .superRefine((value, ctx) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${label} must be in YYYY-MM-DD format` });
        } else if (!isRealDate(value)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${label} is not a valid calendar date` });
        } else if (notInFuture && new Date(value) > new Date()) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${label} cannot be in the future` });
        }
      })
      .optional()
      .nullable()
  );

const employeeZodSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(1, 'Full name is required')
    .max(100, 'Full name cannot exceed 100 characters')
    .regex(/^[A-Za-z\s]+$/, 'Full name must contain only letters and spaces (no numbers or special characters)'),

  employeeId: z
    .string({ required_error: 'Employee ID is required' })
    .trim()
    .min(1, 'Employee ID is required')
    .max(20, 'Employee ID cannot exceed 20 characters')
    .regex(/^EMP\d+$/, 'Employee ID must start with capital EMP followed by numbers (e.g. EMP001)'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .max(150, 'Email cannot exceed 150 characters')
    .email('Invalid email format')
    .regex(/^[a-z0-9._%+-]+@snsgroups\.com$/, 'Email must end with @snsgroups.com domain'),

  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),

  dateOfBirth: optionalDate('Date of birth', { notInFuture: true }),
  gender: optionalEnum(['Male', 'Female', 'Other'], 'Gender'),
  address: z.string().trim().max(500, 'Address cannot exceed 500 characters').optional().nullable(),
  department: optionalEnum(
    ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Admin', 'Other'],
    'Department'
  ),
  position: z.string().trim().max(100, 'Position cannot exceed 100 characters').optional().nullable(),
  joinDate: optionalDate('Join date'),
});

/**
 * Express middleware to validate request body using Zod schema
 */
const validateEmployeeWithZod = (req, res, next) => {
  const result = employeeZodSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    return res.status(400).json({
      success: false,
      message: errorMessages.join(', '),
      errors: result.error.format(),
    });
  }
  // Replace req.body with sanitized & type-safe Zod data
  req.body = result.data;
  next();
};

module.exports = validateEmployeeWithZod;
