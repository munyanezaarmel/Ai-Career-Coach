import { Injectable } from '@nestjs/common';
import { File, FileProvider } from '@prisma/client';
import { Md5 } from 'ts-md5';
import { unlinkSync } from 'fs';

import { PrismaService } from './prisma.service'; 
export interface UploadOptions {
  url: string;
  userId?: string;
  provider?: FileProvider;
  transaction?: any;
}
export interface DeleteOptions {
  fileId: string;
  userId?: string;
  provider?: FileProvider;
}

@Injectable()
export class FileService {

  constructor(
    
    private prismaService: PrismaService,
  ) {

  }
  /**
   * A function that is used to create a file or upload it to given provider
   * @param param0
   * @returns
   */
  async uploadFile({
    url,
    provider = FileProvider.PATH,
    userId,
    transaction,
  }: UploadOptions) {
    return new Promise<File>((resolve) => {
      const handleFileUpload = async (
        tx:any,
      ) => {
        let file = await tx.file.create({
          data: {
            userId,
            provider,
            url,
          },
        });
        switch (provider) {
          case FileProvider.PATH:
            const res = await this.uploadToPath(url, file.id);

            file = await tx.file.update({
              where: {
                id: file.id,
              },
              data: {
                url: res.secure_url,
              },
            });
            unlinkSync(url);
            break;
          case FileProvider.GAVATAR:
            const gavatarUrl = await this.createGavatar(url);
            file = await tx.file.update({
              data: {
                url: gavatarUrl,
              },
              where: {
                id: file.id,
              },
            });
            break;
          case FileProvider.LINK:
            file = await tx.file.update({
              data: { url },
              where: {
                id: file.id,
              },
            });
          default:
        }

        return file;
      };

      if (!transaction)
        return this.prismaService.$transaction(async (tx) => {
          const file = await handleFileUpload(tx);
          return resolve(file);
        });
      handleFileUpload(transaction).then((file) => {
        return resolve(file);
      });
    });
  }
  async deleteFile({
    fileId,
    provider = FileProvider.PATH,
  }: DeleteOptions) {
    return new Promise<File>((resolve) => {
      this.prismaService.$transaction(async (tx) => {
        const file = await tx.file.delete({
          where: {
            id: fileId,
          },
        });
        switch (provider) {
          case FileProvider.PATH:
            await this.removeFromPath(file.url);
          default:
        }
        return file;
      });
    });
  }
  async uploadToPath(url, id) {
    return url;
  }
  async removeFromPath(path:string) {
    return unlinkSync(path)
  }
  async createGavatar(email) {
    const address = String(email).trim().toLowerCase();

    const hash = Md5.hashStr(address);


    return `https://www.gravatar.com/avatar/${hash}?s=32&d=identicon&r=PG`;
  }
}