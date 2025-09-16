import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MinWords, MaxWords } from './validation.decorator';

export class CreatePostDto {
  @ApiProperty({
    example: 'The Future of AI',
    description: 'Title of the blog post (2–6 words)',
  })
  @IsString()
  @IsNotEmpty()
  @MinWords(2)
  @MaxWords(6)
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({
    example: 'Exploring how AI will shape the next decade',
    description: 'Short tagline (5–15 words)',
  })
  @IsString()
  @IsNotEmpty()
  @MinWords(5)
  @MaxWords(15)
  @Transform(({ value }) => value?.trim())
  tagLine: string;

  @ApiProperty({
    example: 'Artificial Intelligence (AI) is transforming industries...',
    description: 'Main content (minimum 50 words, maximum 500 words)',
  })
  @IsString()
  @IsNotEmpty()
  @MinWords(50)
  @MaxWords(500)
  @Transform(({ value }) => value?.trim())
  body: string;
}
