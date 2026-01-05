// API Response Status Codes
// These codes are returned in the API response { code, message, data }

export enum StatusCode {
  // Success codes (2xx)
  SUCCESS = 200,
  CREATED = 201,

  // Client error codes (4xx)
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,

  // Server error codes (5xx)
  INTERNAL_ERROR = 500,

  // Authentication & Authorization (1001-1099)
  INVALID_CREDENTIALS = 1001,
  TOKEN_EXPIRED = 1002,
  INVALID_REFRESH_TOKEN = 1003,
  USER_NOT_VERIFIED = 1004,
  USERNAME_ALREADY_EXISTS = 1005,
  EMAIL_ALREADY_EXISTS = 1006,
  ACCOUNT_NOT_ACTIVE = 1007,
  USER_NOT_FOUND = 1008,

  // User & Role Management (1100-1199)
  ROLE_ALREADY_ASSIGNED = 1100,
  ROLE_NOT_ASSIGNED = 1101,
  ROLE_IN_USE = 1102,
  USER_INACTIVE = 1103,

  // Menu Management (1200-1299)
  MENU_HAS_CHILDREN = 1200,
  MENU_ALREADY_ASSIGNED = 1201,
  MENU_IN_USE = 1202,
  INVALID_PARENT_MENU = 1203,
}

export const StatusMessages: Record<StatusCode, string> = {
  // Success
  [StatusCode.SUCCESS]: 'Success',
  [StatusCode.CREATED]: 'Created successfully',

  // Client errors
  [StatusCode.BAD_REQUEST]: 'Bad request',
  [StatusCode.UNAUTHORIZED]: 'Unauthorized',
  [StatusCode.FORBIDDEN]: 'Forbidden',
  [StatusCode.NOT_FOUND]: 'Resource not found',
  [StatusCode.CONFLICT]: 'Resource already exists',
  [StatusCode.VALIDATION_ERROR]: 'Validation failed',

  // Server errors
  [StatusCode.INTERNAL_ERROR]: 'Internal server error',

  // Authentication & Authorization
  [StatusCode.INVALID_CREDENTIALS]: 'Invalid credentials',
  [StatusCode.TOKEN_EXPIRED]: 'Token expired',
  [StatusCode.INVALID_REFRESH_TOKEN]: 'Invalid refresh token',
  [StatusCode.USER_NOT_VERIFIED]: 'User not verified',
  [StatusCode.USERNAME_ALREADY_EXISTS]: 'Username already exists',
  [StatusCode.EMAIL_ALREADY_EXISTS]: 'Email already exists',
  [StatusCode.ACCOUNT_NOT_ACTIVE]: 'Account is not active',
  [StatusCode.USER_NOT_FOUND]: 'User not found',

  // User & Role Management
  [StatusCode.ROLE_ALREADY_ASSIGNED]: 'Role already assigned',
  [StatusCode.ROLE_NOT_ASSIGNED]: 'Role not assigned',
  [StatusCode.ROLE_IN_USE]: 'Role is in use',
  [StatusCode.USER_INACTIVE]: 'User is inactive',

  // Menu Management
  [StatusCode.MENU_HAS_CHILDREN]: 'Cannot delete menu with children',
  [StatusCode.MENU_ALREADY_ASSIGNED]: 'Menu already assigned',
  [StatusCode.MENU_IN_USE]: 'Menu is in use',
  [StatusCode.INVALID_PARENT_MENU]: 'Invalid parent menu',
};
