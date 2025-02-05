import { USER_TYPE } from "../enum/user.enum";

export class User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    password: string;
    image?: string;
    role: USER_TYPE;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }