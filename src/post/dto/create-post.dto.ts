import { IsNotEmpty, IsString, MinLength, IsMongoId } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly content: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly author: string;
}
