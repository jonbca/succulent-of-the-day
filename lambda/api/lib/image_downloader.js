const { URL } = require('url');

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
  }
};
