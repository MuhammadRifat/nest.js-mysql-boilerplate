export interface IUploadFile {
    fieldName: string;
    fileName: string;
    buffer: Buffer;
    mimetype: string;
    size: number;
}