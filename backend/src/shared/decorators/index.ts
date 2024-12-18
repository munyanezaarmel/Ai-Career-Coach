import {  UseGuards,SetMetadata, applyDecorators } from '@nestjs/common';
// import { Roles } from './roles.decorator';

// import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
// import { Role } from '@prisma/client';
// import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


// export function Auth(...roles: Role[]) {
//   return applyDecorators(
//     SetMetadata(Roles, roles),
//     UseGuards(JwtAuthGuard),
//     ApiBearerAuth(),
//     ApiUnauthorizedResponse({ description: 'Unauthorized' })
//   );
// }