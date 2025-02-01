import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsString()
  @Length(2, 150)
  @IsOptional()
  username?: string;
}
