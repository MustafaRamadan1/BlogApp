import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import mongoose from 'mongoose';
@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: mongoose.Model<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    const posts = await this.PostModel.find();
    return posts;
  }

  async create(post: Post): Promise<Post> {
    const newPost = await this.PostModel.create(post);
    return newPost;
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.PostModel.findById(id);
    return post;
  }

  async updateById(id: string, updatedPost: Post): Promise<Post | null> {
    const post = await this.PostModel.findByIdAndUpdate(id, updatedPost, {
      new: true,
      runValidators: true,
    });
    return post;
  }

  async deleteById(id: string): Promise<Post | null> {
    return await this.PostModel.findByIdAndDelete(id);
  }
}
