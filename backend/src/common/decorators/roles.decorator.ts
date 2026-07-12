import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to one or more roles, e.g. @Roles('ADMIN').
 * Enforced by RolesGuard. This is the heart of our RBAC — a single line on a
 * controller method decides who may call it.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
