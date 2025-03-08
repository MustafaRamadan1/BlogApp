import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { updatePostDto } from './dto/update-post.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
@Controller('api/v1/posts')
export class PostController {
  constructor(private PostService: PostService) {}

  @Get()
  async getAllPosts(
    @Query() query: ExpressQuery,
  ): Promise<{ result: number; posts: PostDocument[] }> {
    const posts = await this.PostService.findAll(query);
    return { result: posts.length, posts };
  }

  @Post()
  async create(@Body() post: CreatePostDto): Promise<PostDocument> {
    const newPost = await this.PostService.create(post);
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

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updatedPost: updatePostDto,
  ) {
    console.log(updatedPost);
    return await this.PostService.updateById(id, updatedPost);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<PostDocument | null> {
    return await this.PostService.deleteById(id);
  }
}
