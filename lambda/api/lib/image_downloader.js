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
    console.log(`extracting id from raw url ${rawDriveUrl}`);
    const driveUrl = new URL(rawDriveUrl);
    const imageId = extractImageId(driveUrl);

    console.log(`found image id ${imageId}`);

    const downloadUrl = generateDownloadUrl(imageId);

    console.log(`generated download url ${downloadUrl}`);

    return downloadUrl;
  },

  async downloadFile(url, outputStream) {
    try {
      console.log(`downloading file from ${url}`);
      const response = await axios.default.get(url, {
        responseType: 'stream',
        headers: {
          Accept: 'image/*'
        }
      });

      return new Promise(resolve => {
        outputStream.on('close', () => {
          console.log(`download complete for ${url}`);
          resolve();
        });

        response.data.pipe(outputStream);
        return null;
      });
    } catch (error) {
      console.error(`Error occurred downloading file from ${url}`, error);
      throw error;
    }
  },

  async uploadImage(key, stream) {
    console.log(`beginning upload of image ${key}`);

    return objectStore
      .putObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Body: stream,
        Key: `images/${key}.jpg`,
        ContentType: 'image/jpeg'
      })
      .promise()
      .then(() => console.log(`completed upload of image ${key}`));
  },

  async transferFile(url) {
    console.log(`transferring file from url ${url}`);

    return tmp.withFile(async ({ path }) => {
      const downloadUrl = this.getDownloadUrl(url);
      console.log(`using download url ${downloadUrl}`);
      const keyName = encodeURIComponent(extractImageId(new URL(url)));

      await this.downloadFile(downloadUrl, fs.createWriteStream(path));
      await this.uploadImage(keyName, fs.createReadStream(path));

      return new URL(
        `https://${
          process.env.S3_BUCKET_NAME
        }.s3.amazonaws.com/images/${keyName}.jpg`
      ).toString();
    });
  }
};
