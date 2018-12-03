const { URL } = require('url');
const axios = require('axios');
const fs = require('fs');

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
  }
};
