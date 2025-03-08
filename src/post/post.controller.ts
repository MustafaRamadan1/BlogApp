import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('api/v1/posts')
export class PostController {
  constructor(private PostService: PostService) {}

  @Get()
  async getAllPosts(@Query() query: ExpressQuery): Promise<{
    postsCount: number;
    posts: PostDocument[] | [];
  }> {
    const posts = await this.PostService.findAll(query);
    return { postsCount: posts.postsCount, posts: posts.posts };
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() post: CreatePostDto, @Req() req): Promise<PostDocument> {
    const newPost = await this.PostService.create(post, req.user);
    return newPost;
  }

  @Get(':id')
  async GetPost(@Param('id') id: string): Promise<PostDocument | null> {
    const post = await this.PostService.findById(id);
    if (!post) {
      throw new NotFoundException('Post  Not Found');
    }

    return post;
  }

  // @Put(':id')
  // @UseGuards(AuthGuard())
  // async updateById(
  //   @Param('id') id: string,
  //   @Body() updatedPost: updatePostDto,
  //   @Req() req,
  // ) {
  //   return await this.PostService.updateById(id, updatedPost);
  // }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<PostDocument | null> {
    return await this.PostService.deleteById(id);
  }
}
