import { DB_TABLES } from "./db.enum";

// global select fields
export const SELECT_FIELDS = {
    [DB_TABLES.USER]: [
        "id",
        "name",
        "email",
        "phone",
        "password",
        "address",
        "image",
        "role",
        "createdAt"
    ],
    [DB_TABLES.ENUM]: [
        "id",
        "key",
        "value",
    ],
    [DB_TABLES.LOG]: [
        "id",
        "tableName",
        "recordId",
        "operation",
        "oldData",
        "newData",
        "userId",
        "createdAt",
    ],
}