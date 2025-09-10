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
    return { message: 'Post created Successfully', post };
  }
  async findAll() {
    return await this.prisma.post.findMany();
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findFirstOrThrow({
      where: { id },
    });
    return { post };
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: { id },
      data: { ...updatePostDto },
    });
    await this.cacheManager.del('allPosts');
    return { message: 'Post Updated Successfully', post };
  }

  async remove(id: string) {
    const post = await this.prisma.post.delete({
      where: { id },
    });
    await this.cacheManager.del('allPosts');
    return { message: 'Deleted Successfully', post };
  }
}
