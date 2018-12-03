const { ImageDownloader } = require('./image_downloader');
const tmp = require('tmp-promise');
const fs = require('fs');

describe('Image downloader', () => {
  it('should compute a download URL for an image', () => {
    const driveUrl = ImageDownloader.getDownloadUrl(
      'https://drive.google.com/open?id=1kQkJ6WBNC3It1sY6jXgHTqwfu8aezzk4'
    );

    expect(ImageDownloader.getDownloadUrl(driveUrl)).toBe(
      'https://drive.google.com/uc?export=download&id=1kQkJ6WBNC3It1sY6jXgHTqwfu8aezzk4'
    );
  });

  describe('downloading', () => {
    it('should download a thing', async () => {
      return tmp.withFile(async ({ path, fd }) => {
        const outputStream = fs.createWriteStream('', { fd });

        await ImageDownloader.downloadFile('http://foo/', outputStream);

        const downloadedData = fs.readFileSync(path);

        expect(downloadedData.toString()).toBe('hello world\n');
      });
    });
  });
});
