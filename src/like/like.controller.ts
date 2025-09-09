import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-guard';
import { GetUser } from 'src/auth/decorators/get-user';

@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post(':id/post')
  @UseGuards(JwtAuthGuard)
  toggleLike(@GetUser('id') userId: string, @Param('id') postId: string) {
    return this.likeService.toggleLike(userId, postId);
  }
  @Get('/count/:id/post')
  getPostLikeCount(@Param('id') postId: string) {
    return this.likeService.getPostLikeCount(postId);
  }
}
