import {FileId} from "../../domain/core/file/FileId";

export interface FileService {
    getById(id: FileId): Promise<File>

    save(file: File): void

    delete(id: FileId): void
}