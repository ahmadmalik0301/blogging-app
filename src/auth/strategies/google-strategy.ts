// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(
//     private config: ConfigService,
//     private authService: AuthService,
//   ) {
//     super({
//       clientID: config.get<string>('GOOGLE_CLIENT_ID')!,
//       clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET')!,
//       callbackURL: config.get<string>('GOOGLE_CALLBACK_URL')!,
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     // Check if user exists or create a new user
//     const { emails, displayName, id } = profile;
//     const email = emails[0].value;

//     const user = await this.authService.validateGoogleUser({
//       email,
//       displayName,
//       googleId: id,
//     });

//     done(null, user); // This will be passed to the controller
//   }
// }
