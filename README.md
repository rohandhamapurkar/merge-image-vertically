# Image Merger - Vertical Image Merging Tool

A Node.js utility for merging multiple images vertically with customizable borders and backgrounds. Perfect for creating collages, combining screenshots, or merging photos into a single vertical image.

## Features

- ✨ Merge multiple images vertically into a single image
- 🖼️ Support for various image formats (JPG, PNG, WebP, TIFF, GIF)
- 🎨 Customizable border size and background color
- 📁 Process individual files or entire directories
- 🏗️ Built with Sharp for high-performance image processing
- 📏 Automatic image centering and dimension calculation
- 🔧 CLI interface for easy command-line usage
- 📦 Can be used as a library in other Node.js projects

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Install Dependencies

```bash
npm install
```

This will install the required dependencies:
- `sharp` - High-performance image processing library

## Usage

### Command Line Interface

#### Merge Individual Images

```bash
node index.js image1.jpg image2.png image3.webp output.png
```

#### Merge All Images in a Directory

```bash
node index.js --dir ./photos merged_photos.png
```

#### Examples

```bash
# Merge specific images
node index.js photo1.jpg photo2.png photo3.webp result.png

# Merge all images in the current directory
node index.js --dir . all_photos.png

# Merge all images in a specific folder
node index.js --dir ./screenshots combined_screenshots.png
```

### As a Library

```javascript
const ImageMerger = require('./index.js');

// Create an instance with custom settings
const merger = new ImageMerger(15, '#f0f0f0'); // 15px border, light gray background

// Merge specific images
async function mergeImages() {
  try {
    const result = await merger.mergeImagesVertically(
      ['image1.jpg', 'image2.png', 'image3.webp'],
      'output.png'
    );
    
    console.log('Merge completed:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Find and merge all images in a directory
async function mergeDirectory() {
  try {
    const images = await merger.findImagesInDirectory('./photos');
    const result = await merger.mergeImagesVertically(images, 'merged.png');
    
    console.log('Directory merge completed:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

mergeImages();
```

## API Reference

### `ImageMerger` Class

#### Constructor

```javascript
new ImageMerger(borderSize = 10, backgroundColor = '#ffffff')
```

- `borderSize` (number): Size of the border around each image in pixels (default: 10)
- `backgroundColor` (string): Background color for borders and canvas (default: '#ffffff')

#### Methods

##### `mergeImagesVertically(imagePaths, outputPath)`

Merges multiple images vertically into a single image.

**Parameters:**
- `imagePaths` (Array<string>): Array of file paths to images to merge
- `outputPath` (string): Path where the merged image will be saved

**Returns:** Promise<Object>
```javascript
{
  outputPath: string,    // Path to the output file
  width: number,         // Width of the merged image
  height: number,        // Height of the merged image
  imageCount: number     // Number of images merged
}
```

##### `findImagesInDirectory(directoryPath)`

Finds all supported image files in a directory.

**Parameters:**
- `directoryPath` (string): Path to the directory to search

**Returns:** Promise<Array<string>> - Array of image file paths

##### `ImageMerger.getSupportedFormats()` (Static)

Returns an array of supported image file extensions.

**Returns:** Array<string> - ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif']

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- TIFF (.tiff)
- GIF (.gif)

## Configuration

### Default Settings

- **Border Size:** 10 pixels
- **Background Color:** White (#ffffff)
- **Output Format:** PNG
- **Image Alignment:** Center horizontally

### Customization Examples

```javascript
// Large border with black background
const merger = new ImageMerger(20, '#000000');

// No border with transparent background
const merger = new ImageMerger(0, { r: 0, g: 0, b: 0, alpha: 0 });

// Custom colored border
const merger = new ImageMerger(5, '#ff6b6b');
```

## Development

### Code Quality Tools

This project uses ESLint and Prettier for code quality:

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Available Scripts

- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix auto-fixable linting errors
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are properly formatted

## How It Works

1. **Image Loading**: Each input image is loaded and its metadata is extracted
2. **Dimension Calculation**: The tool calculates the maximum width needed and total height
3. **Border Addition**: Each image gets a border added around it
4. **Centering**: Images are centered horizontally within the canvas
5. **Composition**: All images are composited vertically into a single image
6. **Output**: The final merged image is saved as a PNG file

## Error Handling

The tool includes comprehensive error handling for:
- Missing or invalid image files
- Unsupported file formats
- File system permissions
- Image processing errors

## Performance

- Uses Sharp library for fast, memory-efficient image processing
- Processes images in sequence to manage memory usage
- Optimized for large images and batch processing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Run the linting and formatting tools
5. Commit your changes (`git commit -am 'Add new feature'`)
6. Push to the branch (`git push origin feature/new-feature`)
7. Create a Pull Request

## License

ISC License

## Dependencies

- [Sharp](https://sharp.pixelplumbing.com/) - High performance Node.js image processing

## Troubleshooting

### Common Issues

**"No supported images found"**
- Check that your directory contains images in supported formats
- Verify file permissions

**"Error merging images"**
- Ensure all input files exist and are readable
- Check available disk space for output file
- Verify Sharp is properly installed

**Memory issues with large images**
- Process images in smaller batches
- Consider resizing images before merging if they're very large

### Getting Help

If you encounter issues:
1. Check that all dependencies are installed correctly
2. Verify your Node.js version is 14 or higher
3. Ensure input images are in supported formats
4. Check file permissions for both input and output directories
