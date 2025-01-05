import { readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Base directory to scan
const baseDir = join(__dirname, "../public/images/gallery/pictures");

function getFilesInSubdirectories(baseDir) {
  const result = {};

  // Get all first-level subdirectories
  const subDirs = readdirSync(baseDir, { withFileTypes: true }).filter(
    (entry) => entry.isDirectory(),
  );

  // Process each subdirectory
  subDirs.forEach((subDir) => {
    const subDirPath = join(baseDir, subDir.name);
    const files = readdirSync(subDirPath, { withFileTypes: true })
      .filter((entry) => entry.isFile()) // Include only files
      .filter((entry) => entry.name.match(/\.(jpe?g|png|gif|webp)$/i)) // Only image files
      .map((entry) => entry.name); // Get file names (just the original files)

    result[subDir.name] = files; // Store the list of original image files
  });

  return result;
}

// Generate the file list
const fileData = getFilesInSubdirectories(baseDir);

// Write to JSON file
const outputFilePath = join(__dirname, "photos.json");
writeFileSync(outputFilePath, JSON.stringify(fileData, null, 2), "utf-8");

console.log(`File list generated successfully at: ${outputFilePath}`);
