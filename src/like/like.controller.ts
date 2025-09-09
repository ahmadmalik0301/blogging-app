import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-guard';
import { GetUser } from 'src/auth/decorators/get-user';

@Controller('like/:id')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('/post/toggle')
  @UseGuards(JwtAuthGuard)
  toggleLike(@GetUser('id') userId: string, @Param('id') postId: string) {
    return this.likeService.toggleLike(userId, postId);
  }
  @Get('/post/count')
  getPostLikeCount(@Param('id') postId: string) {
    return this.likeService.getPostLikeCount(postId);
  }
  @Get('/post/status')
  @UseGuards(JwtAuthGuard)
  getPostLikeStatus(@GetUser('id') userId: string, @Param('id') postId: string) {
    return this.likeService.getPostLikeStatus(userId, postId);
  }
  @Get('/post/users')
  getPostLikers(@Param('id') postId: string) {
    return this.likeService.getPostLikers(postId);
  }
}
