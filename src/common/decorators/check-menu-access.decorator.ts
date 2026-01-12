import { SetMetadata } from '@nestjs/common';

export const CHECK_MENU_ACCESS_KEY = 'checkMenuAccess';

/**
 * Decorator to enable menu access checking for a controller or route
 *
 * Usage:
 * @CheckMenuAccess()
 * @Get('list')
 * async listUsers() { ... }
 *
 * This will automatically check if the user has access to the menu
 * corresponding to the route path
 */
export const CheckMenuAccess = () => SetMetadata(CHECK_MENU_ACCESS_KEY, true);
