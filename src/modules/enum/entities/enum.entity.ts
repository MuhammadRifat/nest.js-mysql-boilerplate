export class Enum {
    id: number;
    key: string;
    value: object; // JSON containing possible values
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }