import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Comment } from './schemas/comment.schema';
import { AuthGuard } from '@nestjs/passport';
import { createCommentDto } from './dto/create-comment.dto';

@Controller('api/v1/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get(':postId')
  async getPostComments(
    @Param('postId') postId: string,
  ): Promise<{ commentsCount: number; comments: Comment[] }> {
    const comments = await this.commentService.findPostComments(postId);
    return { commentsCount: comments.length, comments };
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() comment: createCommentDto,
    @Req() req,
  ): Promise<Comment> {
    const newComment = await this.commentService.create(comment, req.user);
    return newComment;
  }

  //   @Get(':id')
  //   async GetPost(@Param('id') id: string): Promise<PostDocument | null> {
  //     const post = await this.PostService.findById(id);
  //     if (!post) {
  //       throw new NotFoundException('Post  Not Found');
  //     }

  //     return post;
  //   }
}
