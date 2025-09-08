import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPass123!',
    description: 'Your current password',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'NewPass456!',
    description: 'Your new password (must not be same as old)',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    example: 'NewPass456!',
    description: 'Confirmation of your new password (must match newPassword)',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
export class EmailDto {
  @IsEmail()
  email: string;
}
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
