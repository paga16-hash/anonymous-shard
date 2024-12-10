import {FileId} from "../../domain/core/file/FileId.js";

export interface FileService {
    getById(cid: FileId): Promise<File>

    upload(file: File): void

    delete(id: FileId): void
}