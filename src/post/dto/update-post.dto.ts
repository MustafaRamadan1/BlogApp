import { IsOptional, IsString, MinLength } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class updatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly title: string;
  @IsOptional()
  @IsString()
  @MinLength(5)
  readonly content: string;
}
