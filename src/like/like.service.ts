import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async toggleLike(userId: string, postId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { userId_postId: { userId, postId } },
      });
      return { liked: false, postId, userId };
    }

    const like = await this.prisma.like.create({
      data: { userId, postId },
    });
    return { liked: true, postId, userId };
  }
  async getPostLikeCount(postId: string) {
    const count = await this.prisma.like.count({
      where: { postId },
    });
    return { postId, likeCount: count };
  }
}
