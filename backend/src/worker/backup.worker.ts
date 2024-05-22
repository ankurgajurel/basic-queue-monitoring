import { Worker } from 'bullmq';
import connection from '../config/redis';

const backupWorker = new Worker('backup', async job => {
    job.updateProgress({ startTime: new Date().toISOString() });
    console.log('Running backup job:', job.id);
    // Backup job logic here
    job.updateProgress({ endTime: new Date().toISOString() });
}, { connection });

backupWorker.on('completed', job => {
    console.log(`Backup job ${job.id} has completed`);
});

backupWorker.on('failed', (job, err) => {
    console.log(`Backup job ${job?.id} has failed with error ${err.message}`);
});

export default backupWorker;
