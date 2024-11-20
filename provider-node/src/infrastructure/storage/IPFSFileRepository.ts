import {FileRepository} from "../../application/repositories/FileRepository.js";
import {FileId} from "../../domain/core/file/FileId";

export class IPFSFileRepository implements FileRepository {

    //TODO: to implement
    getById(fileId: FileId): File {
        //retrieve file from IPFS
        // @ts-ignore
        return new File();
    }

    save(file: File): void {

    }

    delete(fileId: FileId): void {
    }
}