import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import mongoose from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: mongoose.Model<Post>,
  ) {}

  async findAll(query: ExpressQuery): Promise<Post[] | []> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 2;
    const skip = (page - 1) * limit;
    const postsDocumentsCount = await this.PostModel.countDocuments();
    let posts: Post[] = [];
    if (skip > postsDocumentsCount) {
      return posts;
    } else {
      posts = await this.PostModel.find()
        .limit(limit)
        .skip(skip)
        .sort('-createdAt')
        .populate('author', 'name email')
        .exec();
    }
    return posts;
  }

  async create(post: Post): Promise<Post> {
    const newPost = await this.PostModel.create(post);
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
    const post = await this.PostModel.findByIdAndUpdate(id, updatedPost, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      throw new NotFoundException(`No Post found with ID: ${id}`);
    }
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
