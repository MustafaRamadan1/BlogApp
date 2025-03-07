import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { updatePostDto } from './dto/update-post.dto';

@Controller('api/v1/posts')
export class PostController {
  constructor(private PostService: PostService) {}

  @Get()
  async getAllPosts(): Promise<PostDocument[]> {
    return await this.PostService.findAll();
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
