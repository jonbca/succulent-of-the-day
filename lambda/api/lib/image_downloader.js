const { URL } = require('url');
const axios = require('axios');
const AWS = require('aws-sdk');
const tmp = require('tmp-promise');
const fs = require('fs');

const objectStore = new AWS.S3();

const extractImageId = url => url.searchParams.get('id');
const generateDownloadUrl = id => {
  const downloadUrlBase = new URL(
    'https://drive.google.com/uc?export=download'
  );

  downloadUrlBase.searchParams.set('id', id);

  return downloadUrlBase.href;
};

exports.ImageDownloader = {
  getDownloadUrl(rawDriveUrl) {
    const driveUrl = new URL(rawDriveUrl);
    const imageId = extractImageId(driveUrl);

    return generateDownloadUrl(imageId);
  },

  async downloadFile(url, outputStream) {
    try {
      const response = await axios.default.get(url, {
        responseType: 'stream',
        headers: {
          Accept: 'image/*'
        }
      });

      return new Promise(resolve => {
        outputStream.on('close', () => {
          resolve();
        });

        response.data.pipe(outputStream);
      });
    } catch (error) {
      console.error(`Error occurred downloading file from ${url}`, error);
      throw error;
    }
  },

  async uploadImage(key, stream) {
    return objectStore
      .putObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Body: stream,
        Key: `images/${key}.jpg`,
        ContentType: 'image/jpeg'
      })
      .promise();
  },

  async transferFile(url) {
    return tmp.withFile(async ({ path }) => {
      const downloadUrl = generateDownloadUrl(url);
      const keyName = encodeURIComponent(extractImageId(url));

      await this.downloadFile(downloadUrl, fs.createWriteStream(path));
      await this.uploadImage(keyName, fs.createReadStream(path));

      return new URL(
        `https://${S3_BUCKET_NAME}.s3.amazonaws.com/images/${keyName}.jpg`
      ).toString();
    });
  }
};
