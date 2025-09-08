import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from './email.service';

@Processor('email')
export class EmailWorker extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<{ to: string; subject: string; html: string }>) {
    console.log('Processing email job:', job.data);
    try {
      await this.emailService.sendEmail(job.data.to, job.data.subject, job.data.html);
      console.log('Email sent to:', job.data.to);
    } catch (err) {
      console.error('Failed to send email:', err.message);
      throw err;
    }
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`Job ${job.id} failed: ${err.message}`);
  }
}
