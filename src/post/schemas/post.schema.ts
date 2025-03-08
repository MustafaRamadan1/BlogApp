import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Schema as mongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({
    required: true,
    minlength: [3, 'Title must be at least 3 characters'],
  })
  title: string;

  @Prop({
    required: true,
    minlength: [3, 'Content must be at least 3 characters'],
  })
  content: string;
  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: 'User',
    required: [true, 'post must belongs to an author'],
  })
  author: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
