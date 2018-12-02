const { ImageDownloader } = require('./image_downloader');

describe('Image downloader', () => {
  it('should compute a download URL for an image', () => {
    const driveUrl = ImageDownloader.getDownloadUrl(
      'https://drive.google.com/open?id=1kQkJ6WBNC3It1sY6jXgHTqwfu8aezzk4'
    );

    expect(ImageDownloader.getDownloadUrl(driveUrl)).toBe(
      'https://drive.google.com/uc?export=download&id=1kQkJ6WBNC3It1sY6jXgHTqwfu8aezzk4'
    );
  });
});
