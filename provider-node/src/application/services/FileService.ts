import {FileId} from "../../domain/core/file/FileId.js";

export interface FileService {
    getById(id: FileId): Promise<File>

    save(file: File): void

    delete(id: FileId): void
}