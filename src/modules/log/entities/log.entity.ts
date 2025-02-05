export class Log {
    id?: number;
    tableName: string;
    recordId: number;
    operation: 'update' | 'delete' | 'create';
    oldData?: Record<string, any>;
    newData?: Record<string, any>;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
