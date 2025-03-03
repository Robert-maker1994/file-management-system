import { CustomError } from "../../errorHandle";

export class ConfigError extends CustomError {}
export class DocumentError extends CustomError {}
export class FileVersionError extends CustomError {}
export class DocumentServiceError extends CustomError {}
export class StorageServiceError extends CustomError {}
export class SequelizeConnection extends CustomError {}
