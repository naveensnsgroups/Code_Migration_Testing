const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Personal Details API',
    version: '1.0.0',
    description: 'REST API for managing employee personal details (MERN Stack Personal Details App).',
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Local development' },
  ],
  tags: [
    { name: 'Health', description: 'Service status' },
    { name: 'Employees', description: 'Employee records' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Personal Details API is running.' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/employees': {
      get: {
        tags: ['Employees'],
        summary: 'Get all employees',
        description: 'Returns a paginated list of employees, newest first.',
        parameters: [
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 } },
        ],
        responses: {
          200: {
            description: 'A page of employees',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 1 },
                    total: { type: 'integer', example: 1 },
                    page: { type: 'integer', example: 1 },
                    pages: { type: 'integer', example: 1 },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Employee' } },
                  },
                },
              },
            },
          },
          429: { $ref: '#/components/responses/TooManyRequests' },
        },
      },
      post: {
        tags: ['Employees'],
        summary: 'Create an employee',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/EmployeeInput' } },
          },
        },
        responses: {
          201: {
            description: 'Employee created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Employee created successfully' },
                    data: { $ref: '#/components/schemas/Employee' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          409: { $ref: '#/components/responses/Conflict' },
          429: { $ref: '#/components/responses/TooManyRequests' },
        },
      },
    },
    '/api/employees/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, description: 'MongoDB ObjectId of the employee', schema: { type: 'string', example: '665f1c2b9a1e4b3d2c8f1a2b' } },
      ],
      get: {
        tags: ['Employees'],
        summary: 'Get an employee by ID',
        responses: {
          200: {
            description: 'Employee found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Employee' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/InvalidId' },
          404: { $ref: '#/components/responses/NotFound' },
          429: { $ref: '#/components/responses/TooManyRequests' },
        },
      },
      put: {
        tags: ['Employees'],
        summary: 'Update an employee',
        description: 'Updates the provided fields. Validation rules are the same as for create.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/EmployeeInput' } },
          },
        },
        responses: {
          200: {
            description: 'Employee updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Employee updated successfully' },
                    data: { $ref: '#/components/schemas/Employee' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFound' },
          409: { $ref: '#/components/responses/Conflict' },
          429: { $ref: '#/components/responses/TooManyRequests' },
        },
      },
      delete: {
        tags: ['Employees'],
        summary: 'Delete an employee',
        responses: {
          200: {
            description: 'Employee deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Employee deleted successfully' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/InvalidId' },
          404: { $ref: '#/components/responses/NotFound' },
          429: { $ref: '#/components/responses/TooManyRequests' },
        },
      },
    },
  },
  components: {
    schemas: {
      EmployeeInput: {
        type: 'object',
        required: ['fullName', 'employeeId', 'email', 'phone'],
        properties: {
          fullName: { type: 'string', maxLength: 100, pattern: '^[A-Za-z\\s]+$', example: 'Jane Doe', description: 'Letters and spaces only' },
          employeeId: { type: 'string', maxLength: 20, pattern: '^EMP\\d+$', example: 'EMP001', description: 'Must be unique' },
          email: { type: 'string', maxLength: 150, format: 'email', example: 'jane.doe@snsgroups.com', description: 'Must be unique and end with @snsgroups.com' },
          phone: { type: 'string', pattern: '^\\d{10}$', example: '9876543210', description: 'Exactly 10 digits' },
          dateOfBirth: { type: 'string', nullable: true, example: '1995-04-12' },
          gender: { type: 'string', nullable: true, enum: ['Male', 'Female', 'Other', ''] },
          address: { type: 'string', nullable: true, maxLength: 500 },
          department: { type: 'string', nullable: true, enum: ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Admin', 'Other', ''] },
          position: { type: 'string', nullable: true, maxLength: 100, example: 'Software Engineer' },
          joinDate: { type: 'string', nullable: true, example: '2024-01-15' },
        },
      },
      Employee: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665f1c2b9a1e4b3d2c8f1a2b' },
          fullName: { type: 'string', example: 'Jane Doe' },
          employeeId: { type: 'string', example: 'EMP001' },
          email: { type: 'string', example: 'jane.doe@snsgroups.com' },
          phone: { type: 'string', example: '9876543210' },
          dateOfBirth: { type: 'string', format: 'date-time', nullable: true },
          gender: { type: 'string', enum: ['Male', 'Female', 'Other'], nullable: true },
          address: { type: 'string', nullable: true },
          department: { type: 'string', enum: ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Admin', 'Other'], nullable: true },
          position: { type: 'string', nullable: true },
          joinDate: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Employee not found' },
        },
      },
    },
    responses: {
      ValidationError: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: {
              allOf: [
                { $ref: '#/components/schemas/Error' },
                { type: 'object', properties: { errors: { type: 'object' } } },
              ],
            },
          },
        },
      },
      InvalidId: {
        description: 'Invalid employee ID format',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      NotFound: {
        description: 'Employee not found',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Conflict: {
        description: 'A unique field (employeeId or email) already exists',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      TooManyRequests: {
        description: 'Rate limit exceeded (100 requests per 15 minutes per IP)',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
    },
  },
};

module.exports = swaggerDocument;
