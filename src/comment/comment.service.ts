import { Comment } from './schemas/comment.schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
import { createCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: mongoose.Model<Comment>,
  ) {}

  async findAll(query: ExpressQuery): Promise<Comment[] | []> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 2;
    const skip = (page - 1) * limit;
    const commentDocumentsCount = await this.commentModel.countDocuments();
    let comments: Comment[] = [];
    if (skip > commentDocumentsCount) {
      return comments;
    } else {
      comments = await this.commentModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort('-createdAt')
        .populate('user', 'name email')
        .exec();
    }
    return comments;
  }

  async create(comment: createCommentDto, user: User): Promise<Comment> {
    console.log(comment);
    const newComment = await this.commentModel.create({
      comment: comment.comment,
      post: comment.post,
      user: user._id,
    });
    return newComment;
  }

  async findById(id: string): Promise<Comment | null> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException(`Invalid Comment ID: ${id}`);
    }
    const comment = await this.commentModel
      .findById(id)
      .populate('user ', 'name email')
      .populate('post', 'title content')
      .exec();

    if (!comment) {
      throw new NotFoundException(`No comment found with ID: ${id}`);
    }
    return comment;
  }

  async findPostComments(
    id: string,
    query: ExpressQuery,
  ): Promise<Comment[] | []> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 2;
    const skip = (page - 1) * limit;
    const commentDocumentsCount = await this.commentModel.countDocuments();
    let comments: Comment[] = [];
    if (skip > commentDocumentsCount) {
      return comments;
    } else {
      comments = await this.commentModel
        .find({ post: id })
        .limit(limit)
        .skip(skip)
        .sort('-createdAt')
        .populate('user', 'name email')
        .exec();
    }
    return comments;
  }
}
