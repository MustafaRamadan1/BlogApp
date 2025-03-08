import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Schema as mongooseSchema } from 'mongoose';
import { Post } from 'src/post/schemas/post.schema';

@Schema({ timestamps: true })
export class Comment {
  @Prop({
    required: true,
    minlength: [3, 'comment must be at least 3 characters'],
  })
  comment: string;

  @Prop({
    required: [true, 'Comment must belongs to a post'],
    type: mongooseSchema.Types.ObjectId,
    ref: 'Post',
  })
  post: Post;
  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: 'User',
    required: [true, 'comment must belongs to an user'],
  })
  user: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
