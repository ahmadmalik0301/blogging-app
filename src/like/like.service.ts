import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async toggleLike(userId: string, postId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { userId_postId: { userId, postId } },
      });
      return {
        status: 'success',
        message: 'Post unliked successfully',
        data: { liked: false, postId, userId },
      };
    }

    const like = await this.prisma.like.create({ data: { userId, postId } });
    return {
      status: 'success',
      message: 'Post liked successfully',
      data: { liked: true, postId, userId },
    };
  }

  async getPostLikeCount(postId: string) {
    const count = await this.prisma.like.count({ where: { postId } });
    return {
      status: 'success',
      message: 'Post like count retrieved',
      data: { postId, likeCount: count },
    };
  }

  async getPostLikeStatus(userId: string, postId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return {
      status: 'success',
      message: 'Post like status retrieved',
      data: { postId, liked: !!existingLike },
    };
  }

  async getPostLikers(postId: string, page = 1) {
    const limit = 5;
    const skip = (page - 1) * limit;

    // Total count for pagination metadata
    const total = await this.prisma.like.count({
      where: { postId },
    });

    const likers = await this.prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      skip,
      take: limit,
    });

    const maskEmail = (email: string) => {
      const [local, domain] = email.split('@');
      if (local.length <= 2) return '*'.repeat(local.length) + '@' + domain;
      const visible = local.slice(0, 2);
      return `${visible}${'*'.repeat(local.length - 2)}@${domain}`;
    };

    return {
      status: 'success',
      message: 'Post likers retrieved',
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        perPage: limit,
      },
      data: likers.map((like) => ({
        ...like.user,
        email: maskEmail(like.user.email),
      })),
    };
  }
}
