import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: createPostDto,
    });
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
    return { message: 'Post Updated Successfully', post };
  }

  async remove(id: string) {
    const post = await this.prisma.post.delete({
      where: { id },
    });
    return { message: 'Deleted Successfully', post };
  }
}
