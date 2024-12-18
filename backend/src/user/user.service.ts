import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { FileProvider, User } from '@prisma/client';
import { PrismaService } from '@/shared/services/prisma.service';
import { EmailService } from '@/shared/services/email.service';
import { FileService, UploadOptions } from '@/shared/services/file.service';
import { hashPassword } from '@/shared/functions/hash';
import { generateOTP } from '@/shared/functions/otp';
import { UserProfileDto } from './dto';

interface UpdateProfileOptions {
  userId: string;
  profile: UserProfileDto;
}
interface FilterOption {
  email?: string;
  id?: string;
  username?: string;
}
@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private fileService: FileService,
  ) {
    //constructor
  }
  /**
   * Create the user and his profile and add to all the communities that he was invited in
   * @param signupUser
   * @returns user
   */
  async addUser({
    provider = 'LOCAL',
    pictureUrl,
    ...signupUser
  }: Partial<User> & {
    pictureUrl?: string;
    provider?: string;
    firstName: string;
  }) {
    const userExists = await this.prismaService.user.findFirst({
      where: {
        email: signupUser.email?.trim().toLowerCase(),
      },
    });
    console.log(userExists);
    if (userExists)
      throw new ConflictException(
        'User with that email or username already exists',
      );
    const user = await this.prismaService.user.create({
      data: {
        ...signupUser,
        email: signupUser.email.trim().toLowerCase(),
        password:
          provider == 'GOOGLE' ? null : hashPassword(signupUser.password),
        verified: provider == 'LOCAL' || provider == 'GOOGLE',
      },
    });

    let profileOptions: UploadOptions;
    if (!pictureUrl) {
      profileOptions = {
        url: user.email,
        provider: FileProvider.GAVATAR,
        userId: user.id,
      };
    } else {
      profileOptions = {
        url: pictureUrl,
        provider: FileProvider.LINK,
        userId: user.id,
      };
    }
    console.log(profileOptions);
    const avatar = await this.fileService.uploadFile(profileOptions);

    // if (provider == 'LOCAL') {
    //   const otp = generateOTP(6);
    //   await this.emailService.sendEmail({
    //     description: `Your verification code is `,
    //     to: user.email,
    //     highlightedText: otp,
    //     title: 'Sangwas Account verification',
    //   });
    //   await this.prismaService.token.create({
    //     data: {
    //       token: otp,
    //       role: 'ACCOUNT_VERIFICATION',
    //       userId: user.id,
    //     },
    //   });
    // }

    return user;
  }

  async findUserBy(options: FilterOption) {
    return this.prismaService.user.findFirst({
      where: options,
    });
  }
  async fetchUserProfile(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
  async getPublicProfile(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: id }, { id }],
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async updateProfileImage({
    filePath,
    userId,
  }: {
    filePath: string;
    userId: string;
  }) {
    return this.prismaService.$transaction(
      async (tx) => {
        let profile = await tx.user.findFirst({
          where: {
            id: userId,
          },
        });

        const file = await this.fileService.uploadFile({
          url: filePath,
          provider: FileProvider.PATH,
          userId,
          transaction: tx,
        });
        return tx.user.update({
          where: {
            id: profile.id,
          },
          data: {
            profilePicture: file.url,
          },
        });
      },
      { timeout: 120000, maxWait: 120000 },
    );
  }
  async updateUserProfile({ userId, profile }: UpdateProfileOptions) {
    const userProfile = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {},
    });
    return userProfile;
  }

  async deleteUserAccount(userId: string) {
    const user = this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    await this.prismaService.$transaction(
      async (tx) => {
        if (!user) throw new NotFoundException('User profile was not found');
        await tx.user.delete({
          where: { id: userId },
        });
      },
      {
        timeout: 1200000,
        maxWait: 1200000,
      },
    );
    await this.deleteUserFiles(userId);
    return true;
  }
  async deleteUserFiles(userId: string) {
    const files = await this.prismaService.file.findMany({
      where: {
        userId,
      },
    });
    const deleteFiles = files.map(async (file) => {
      await this.fileService.deleteFile({
        userId,
        fileId: file.id,
      });
    });
    return await Promise.all(deleteFiles);
  }
}
