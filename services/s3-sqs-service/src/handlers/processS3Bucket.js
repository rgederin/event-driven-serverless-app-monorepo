import s3 from '../../../../libs/s3-lib';
import { sendToSqs } from '../utils/sender';

const BATCH_SIZE = 25;

export async function main(event) {
    console.log("processS3Bucket lambda event: ", event);

    await Promise.all(
        event.Records.map(async (record) => {
            try {
                // Get original text from object in incoming event
                const originalText = await s3.getObject(buildS3Params(record));

                //Convert to json format
                const jsonData = JSON.parse(originalText.Body.toString('utf-8'));

                //Split to batches (25 items in the batch)
                const batches = splitToBatches(jsonData);

                //Send batches to SQS
                await sendToSqs(batches, process.env.QUEUE_URL);
            } catch (err) {
                console.error(err);
            }
        })
    );
};

const buildS3Params = record => {
    return {
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key
    };
};

const splitToBatches = data => {
    // Split data into batches for upload
    let batches = [];

    while (data.length > 0) {
        batches.push(data.splice(0, BATCH_SIZE));
    }
    console.log(`total batches: ${batches.length}`);

    return batches;
};
