import { Worker } from 'bullmq';
import connection from '../config/redis';

const emailWorker = new Worker('email', async job => {
    job.updateProgress({ startTime: new Date().toISOString() });
    console.log('Sending email job:', job.id);
    // Email sending logic here
    job.updateProgress({ endTime: new Date().toISOString() });
}, { connection });

emailWorker.on('completed', job => {
    console.log(`Email job ${job.id} has completed`);
});

emailWorker.on('failed', (job, err) => {
    console.log(`Email job ${job?.id} has failed with error ${err.message}`);
});

export default emailWorker;
