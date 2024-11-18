import {FileRepository} from "../../application/repositories/FileRepository.js";
import {FileId} from "../../domain/core/file/FileId";

export class IPFSFileRepository implements FileRepository {

    getById(fileId: FileId): File {
        return new File();
        //retrieve file from IPFS

    }

    save(file: File): void {

    }

    delete(fileId: FileId): void {
    }
}