import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: mongoose.Model<Post>,
  ) {}

  async findAll(): Promise<Post[] | []> {
    const posts = await this.PostModel.find()
      .sort('-createdAt')
      .populate('author', 'name email')
      .exec();

    return posts;
  }

  async create(post: Post, user: User): Promise<Post> {
    const data = Object.assign(post, { author: user._id });

    const newPost = await this.PostModel.create(data);
    return newPost;
  }

  async findById(id: string): Promise<Post | null> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException(`Invalid Post ID: ${id}`);
    }
    const post = await this.PostModel.findById(id)
      .populate('author', 'name email')
      .exec();

    if (!post) {
      throw new NotFoundException(`No Post found with ID: ${id}`);
    }
    return post;
  }

  async updateById(id: string, updatedPost: Post): Promise<Post | null> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException(`Invalid Post ID: ${id}`);
    }

    const targetedPost = await this.PostModel.findById(id);
    if (!targetedPost) {
      throw new NotFoundException(`No Post found with ID: ${id}`);
    }

    const post = await this.PostModel.findByIdAndUpdate(id, updatedPost, {
      new: true,
      runValidators: true,
    });

    return post;
  }

  async deleteById(id: string): Promise<Post | null> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException(`Invalid Post ID: ${id}`);
    }
    return await this.PostModel.findByIdAndDelete(id);
  }
}
