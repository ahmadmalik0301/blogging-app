import { Controller, Get, Param, Post, UseGuards, Body, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-guard';
import { GetUser } from 'src/auth/decorators/get-user';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('toggle/:postId')
  @UseGuards(JwtAuthGuard)
  toggleLike(@GetUser('id') userId: string, @Param('postId') postId: string) {
    return this.likeService.toggleLike(userId, postId);
  }

  @Get('count/:postId')
  getPostLikeCount(@Param('postId') postId: string) {
    return this.likeService.getPostLikeCount(postId);
  }

  @Get('status/:postId')
  @UseGuards(JwtAuthGuard)
  getPostLikeStatus(@GetUser('id') userId: string, @Param('postId') postId: string) {
    return this.likeService.getPostLikeStatus(userId, postId);
  }

  @Get('users/:postId')
  getPostLikers(@Param('postId') postId: string, @Query('page') page = '1') {
    return this.likeService.getPostLikers(postId, Number(page));
  }
}
