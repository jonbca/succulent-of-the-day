const { ImageDownloader } = require('./lib/image_downloader');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event, context) => {
  const records = event.Records.map(async record => {
    const { body } = record;
    const content = JSON.parse(body);

    console.log('Handling record', content);

    content.cachedImageUrl = await ImageDownloader.transferFile(
      content.imageUrl
    );

    console.info(
      `stored image to s3 bucket location with url ${content.cachedImageUrl}`
    );

    try {
      return s3
        .putObject({
          Key: `data/${content.row}.json`,
          ContentType: 'application/json',
          Bucket: process.env.S3_BUCKET_NAME,
          Body: JSON.stringify(content)
        })
        .promise();
    } catch (err) {
      console.error('Failed to store record to s3', err);
    }
  });

  return Promise.all(records);
};
