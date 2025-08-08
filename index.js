const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ImageMerger {
  constructor(borderSize = 10, backgroundColor = '#ffffff') {
    this.borderSize = borderSize;
    this.backgroundColor = backgroundColor;
  }

  async mergeImagesVertically(imagePaths, outputPath) {
    try {
      if (!imagePaths || imagePaths.length === 0) {
        throw new Error('No image paths provided');
      }

      console.log(`Processing ${imagePaths.length} images...`);

      // Load and process all images
      const processedImages = [];
      let maxWidth = 0;
      let totalHeight = 0;

      for (const imagePath of imagePaths) {
        console.log(`Processing: ${path.basename(imagePath)}`);

        // Check if file exists
        await fs.access(imagePath);

        // Load image and get metadata
        const image = sharp(imagePath);
        const metadata = await image.metadata();

        // Calculate dimensions with border
        const imageWithBorder = {
          image: image,
          width: metadata.width + this.borderSize * 2,
          height: metadata.height + this.borderSize * 2,
          originalWidth: metadata.width,
          originalHeight: metadata.height,
        };

        processedImages.push(imageWithBorder);

        // Track maximum width and total height
        maxWidth = Math.max(maxWidth, imageWithBorder.width);
        totalHeight += imageWithBorder.height;
      }

      console.log(`Final canvas size: ${maxWidth}x${totalHeight}`);

      // Create the composite operations array
      const compositeOps = [];
      let currentY = 0;

      for (const processedImage of processedImages) {
        // Create a bordered version of each image
        const borderedImageBuffer = await processedImage.image
          .resize(processedImage.originalWidth, processedImage.originalHeight)
          .extend({
            top: this.borderSize,
            bottom: this.borderSize,
            left: this.borderSize,
            right: this.borderSize,
            background: this.backgroundColor,
          })
          .png()
          .toBuffer();

        // Add to composite operations
        compositeOps.push({
          input: borderedImageBuffer,
          top: currentY,
          left: Math.floor((maxWidth - processedImage.width) / 2), // Center horizontally
        });

        currentY += processedImage.height;
      }

      // Create the final merged image
      const mergedImage = sharp({
        create: {
          width: maxWidth,
          height: totalHeight,
          channels: 4,
          background: this.backgroundColor,
        },
      })
        .composite(compositeOps)
        .png();

      // Save the result
      await mergedImage.toFile(outputPath);

      console.log(`✅ Successfully merged images to: ${outputPath}`);
      console.log(`Final dimensions: ${maxWidth}x${totalHeight}px`);

      return {
        outputPath,
        width: maxWidth,
        height: totalHeight,
        imageCount: imagePaths.length,
      };
    } catch (error) {
      console.error('❌ Error merging images:', error.message);
      throw error;
    }
  }

  // Utility method to get supported image formats
  static getSupportedFormats() {
    return ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif'];
  }

  // Utility method to find images in a directory
  async findImagesInDirectory(directoryPath) {
    try {
      const files = await fs.readdir(directoryPath);
      const supportedFormats = ImageMerger.getSupportedFormats();

      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return supportedFormats.includes(ext);
      });

      return imageFiles.map(file => path.join(directoryPath, file));
    } catch (error) {
      console.error('Error reading directory:', error.message);
      return [];
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log(
      '  node image-merger.js <image1> <image2> [image3] ... [output.png]'
    );
    console.log('  node image-merger.js --dir <directory> [output.png]');
    console.log('');
    console.log('Examples:');
    console.log('  node image-merger.js img1.jpg img2.png merged.png');
    console.log('  node image-merger.js --dir ./photos merged_photos.png');
    process.exit(1);
  }

  async function runCLI() {
    const merger = new ImageMerger(10, '#ffffff');

    try {
      if (args[0] === '--dir') {
        // Directory mode
        const directory = args[1];
        const outputPath = args[2] || './merged_images.png';

        const images = await merger.findImagesInDirectory(directory);
        if (images.length === 0) {
          console.log('No supported images found in directory:', directory);
          process.exit(1);
        }

        console.log(`Found ${images.length} images in directory`);
        await merger.mergeImagesVertically(images, outputPath);
      } else {
        // Individual files mode
        const outputPath = args[args.length - 1].endsWith('.png')
          ? args.pop()
          : './merged_images.png';
        const imagePaths = args;

        await merger.mergeImagesVertically(imagePaths, outputPath);
      }
    } catch (error) {
      console.error('CLI Error:', error.message);
      process.exit(1);
    }
  }

  runCLI();
}

module.exports = ImageMerger;
