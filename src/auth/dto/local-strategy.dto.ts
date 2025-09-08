import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

function formatName(value: string): string {
  if (!value) return value;
  const trimmed = value.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => formatName(value))
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => formatName(value))
  lastName: string;

  @IsDateString()
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  dateOfBirth: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value?.trim())
  password: string;
}

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value?.trim())
  password: string;
}
