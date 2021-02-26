import { v4 } from 'uuid';
import sqs from '../../../../libs/sqs-lib';

export async function sendToSqs(batches, queueUrl) {
    let batchCount = 0;

    // Save each batch
    await Promise.all(
        batches.map(async (itemData) => {
            const items = [];

            itemData.forEach(item => {
                for (let key of Object.keys(item)) {
                    // An AttributeValue may not contain an empty string
                    if (item[key] === '')
                        delete item[key];
                }

                // Build params
                items.push({
                    id: v4(),
                    ...item
                });
            });

            // Push to SQS in batches
            try {
                batchCount++;
                console.log('trying batch: ', batchCount);
                const result = await sqs.sendMessage(buildSQSParams(items, queueUrl));
                console.log('success: ', result);
            } catch (err) {
                console.error('error: ', err);
            }
        })
    );
}

const buildSQSParams = (items, queueUrl) => {
    return {
        MessageBody: JSON.stringify(items),
        QueueUrl: queueUrl
    };
};
