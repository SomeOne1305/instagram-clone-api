import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { UploadOptions, UploadResponse } from 'imagekit/dist/libs/interfaces';
import IKResponse from 'imagekit/dist/libs/interfaces/IKResponse';
import storageConfig from 'src/configs/storage.config';

@Injectable()
export class StorageService {
  private imagekit: ImageKit;
  constructor() {
    this.imagekit = new ImageKit(storageConfig());
  }
  upload(uploadOptions: UploadOptions): Promise<IKResponse<UploadResponse>> {
    return this.imagekit.upload(uploadOptions);
  }

  deleteFile(fileId: string): Promise<any> {
    return this.imagekit.deleteFile(fileId);
  }

  getFileDetails(fileId: string): Promise<any> {
    return this.imagekit.getFileDetails(fileId);
  }

  listFiles(options?: any): Promise<any> {
    return this.imagekit.listFiles(options);
  }

  updateFileDetails(fileId: string, updateData: any): Promise<any> {
    return this.imagekit.updateFileDetails(fileId, updateData);
  }

  bulkDeleteFiles(fileIds: string[]): Promise<any> | void {
    return this.imagekit.bulkDeleteFiles(fileIds);
  }

  createFolder(folderName: string, parentFolderPath?: string): Promise<any> {
    return this.imagekit.createFolder({ folderName, parentFolderPath });
  }

  deleteFolder(folderPath: string): Promise<any> {
    return this.imagekit.deleteFolder(folderPath);
  }

  copyFile(sourceFilePath: string, destinationPath: string): Promise<any> {
    return this.imagekit.copyFile({ sourceFilePath, destinationPath });
  }

  moveFile(sourceFilePath: string, destinationPath: string): Promise<any> {
    return this.imagekit.moveFile({ sourceFilePath, destinationPath });
  }

  copyFolder(sourceFolderPath: string, destinationPath: string): Promise<any> {
    return this.imagekit.copyFolder({ sourceFolderPath, destinationPath });
  }

  moveFolder(sourceFolderPath: string, destinationPath: string): Promise<any> {
    return this.imagekit.moveFolder({ sourceFolderPath, destinationPath });
  }

  getFileMetadata(fileId: string): Promise<any> {
    return this.imagekit.getFileMetadata(fileId);
  }

  getAuthenticationParameters(token?: string, expire?: number): any {
    return this.imagekit.getAuthenticationParameters(token, expire);
  }
}
