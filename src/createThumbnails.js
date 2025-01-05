import { readdirSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

// 1) __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// 2) Base directories
const originalBaseDir = join(__dirname, "../public/images/gallery/pictures");
const thumbsBaseDir = join(__dirname, "../public/images/gallery/thumbnails");

// Logging storage
const logs = {
  info: [],
  warnings: 0,
  errors: [],
};

// Utility functions for logging
function logInfo(message) {
  logs.info.push(message);
}
function logWarning() {
  logs.warnings++;
}
function logError(message) {
  logs.errors.push(message);
}

// Ensure the thumbnails base directory exists
if (!existsSync(thumbsBaseDir)) {
  mkdirSync(thumbsBaseDir);
  logInfo(`📂 Created thumbnails base directory: ${thumbsBaseDir}`);
}

// 3) Iterate subdirectories
const subDirs = readdirSync(originalBaseDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

for (const subDirName of subDirs) {
  const subDirPath = join(originalBaseDir, subDirName);
  const subDirThumbPath = join(thumbsBaseDir, subDirName);

  // Ensure subdirectory in the "thumbnails" folder exists
  if (!existsSync(subDirThumbPath)) {
    mkdirSync(subDirThumbPath);
    logInfo(`📁 Created thumbnails subdirectory: ${subDirThumbPath}`);
  }

  // Find all image files in the subdirectory
  const files = readdirSync(subDirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .filter((dirent) => dirent.name.match(/\.(jpe?g|png|gif|webp)$/i)) // Only image files
    .map((dirent) => dirent.name);

  for (const fileName of files) {
    const inputPath = join(subDirPath, fileName);
    const outputPath = join(subDirThumbPath, fileName);

    // Skip thumbnail generation if it already exists
    if (existsSync(outputPath)) {
      logWarning();
      continue;
    }

    // Generate the thumbnail
    try {
      sharp(inputPath)
        .resize({ width: 640 }) // Set max width to 640px
        .toFile(outputPath);

      logInfo(`🖼️ Created thumbnail: ${outputPath}`);
    } catch (err) {
      logError(`❌ Error creating thumbnail for ${fileName}: ${err.message}`);
    }
  }
}

// Output all logs as a summary
console.log("\n✨ --- Summary --- ✨");
if (logs.info.length > 0) {
  console.log("✅ Completed tasks:");
  logs.info.forEach((log) => console.log(`  - ${log}`));
}
if (logs.warnings > 0) {
  console.warn(`⚠️ Skipped ${logs.warnings} existing thumbnails.`);
}
if (logs.errors.length > 0) {
  console.error("❌ Errors encountered:");
  logs.errors.forEach((log) => console.error(`  - ${log}`));
} else {
  console.log("🎉 No errors! All good to go.");
}
