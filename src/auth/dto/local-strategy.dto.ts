import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

function formatName(value: string): string {
  if (!value) return value;
  const trimmed = value.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => formatName(value))
  firstName: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => formatName(value))
  lastName?: string;

  @ApiProperty({ example: '2000-05-20', required: false })
  @IsDateString()
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value?.trim())
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value?.trim())
  password: string;
}
