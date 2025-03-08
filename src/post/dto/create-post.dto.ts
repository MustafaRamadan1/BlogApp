import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsMongoId,
  IsEmpty,
} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly content: string;

  @IsEmpty({ message: 'You are not allowed to pass your ID' })
  readonly author: User;
}
