import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: createPostDto,
    });
    await this.cacheManager.del('allPosts');
    return { status: 'success', message: 'Post created successfully', data: post };
  }

  async findAll(page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count(),
    ]);

    return {
      status: 'success',
      message: 'Posts retrieved successfully',
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findFirstOrThrow({ where: { id } });
    return { status: 'success', message: 'Post retrieved successfully', data: post };
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: { id },
      data: { ...updatePostDto },
    });
    await this.cacheManager.del('allPosts');
    return { status: 'success', message: 'Post updated successfully', data: post };
  }

  async remove(id: string) {
    const post = await this.prisma.post.delete({ where: { id } });
    await this.cacheManager.del('allPosts');
    return { status: 'success', message: 'Post deleted successfully', data: post };
  }
}
