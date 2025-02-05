import { SetMetadata } from '@nestjs/common';
import { USER_TYPE } from 'src/modules/user/enum/user.enum';

export const UserTypes = (...args: USER_TYPE[]) =>
  SetMetadata('userTypes', args);