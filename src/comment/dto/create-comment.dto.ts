import { IsNotEmpty, IsString, MinLength, IsMongoId } from 'class-validator';
import { Post } from 'src/post/schemas/post.schema';

export class createCommentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly comment: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly post: Post;
}
