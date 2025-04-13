import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = 'public';
const outputDir = 'public';

async function convertToWebP() {
  try {
    // 入力ディレクトリ内のファイルを取得
    const files = await fs.readdir(inputDir);

    // jpg/jpeg/pngファイルを抽出
    const imageFiles = files.filter(
      file => /\.(jpg|jpeg|png)$/i.test(file) && file.match(/^img\d+\.(jpg|jpeg|png)$/i)
    );

    console.log(`Found ${imageFiles.length} images to convert`);

    // 各画像を変換
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

      // 高品質版の生成
      await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

      console.log(`Converted ${file} to WebP`);

      // 低解像度版の生成（プレースホルダー用）
      const lowResPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '-low.webp'));
      await sharp(inputPath)
        .resize({ width: 20 }) // 極小サイズに
        .blur(5) // ぼかしを追加
        .webp({ quality: 30 })
        .toFile(lowResPath);

      console.log(`Created low-res version of ${file}`);
    }

    console.log('All images have been converted successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

convertToWebP();
