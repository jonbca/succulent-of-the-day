const { ImageDownloader } = require('./lib/image_downloader');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event, context) => {
  const records = event.Records.map(async record => {
    const { body } = record;
    const content = JSON.parse(body);

    content.imageUrl = await ImageDownloader.transferFile(content.href);

    return s3
      .putObject({
        Key: `data/${content.row}.json`,
        ContentType: 'application/json',
        Bucket: process.env.S3_BUCKET_NAME,
        Body: JSON.stringify(content)
      })
      .promise();
  });

  return await Promise.all(records);
};
