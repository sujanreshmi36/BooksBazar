import { SetMetadata } from '@nestjs/common';
import { roleType as Role } from 'src/helper/types/index.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);