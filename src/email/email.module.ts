import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailWorker } from './email.worker';

@Module({
  providers: [EmailService, EmailWorker],
})
export class EmailModule {}
