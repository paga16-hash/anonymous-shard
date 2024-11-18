import {FileId} from "../../domain/core/file/FileId.js";

export interface FileRepository {
    getById(fileId: FileId): File

    save(file: File): void

    delete(fileId: FileId): void
}