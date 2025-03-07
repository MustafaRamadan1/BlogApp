import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const PostSchema = SchemaFactory.createForClass(Post);
