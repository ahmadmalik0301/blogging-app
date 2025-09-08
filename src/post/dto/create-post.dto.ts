import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'The Future of AI',
    description: 'Title of the blog post (10–25 characters)',
    minLength: 10,
    maxLength: 25,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(25)
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({
    example: 'Exploring how AI will shape the next decade',
    description: 'Short tagline (10–70 characters)',
    minLength: 10,
    maxLength: 70,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(70)
  @Transform(({ value }) => value?.trim())
  tagLine: string;

  @ApiProperty({
    example: 'Artificial Intelligence (AI) is transforming industries...',
    description: 'Main content of the blog post (10–1000 characters)',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  @Transform(({ value }) => value?.trim())
  body: string;
}
