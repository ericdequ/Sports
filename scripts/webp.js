/**
 * simple-webp.js
 *
 * Usage:
 *   cd ~/Desktop/RobotRic/robotric
 *   node scripts/simple-webp.js
 *
 * What it does:
 * 1. Recursively finds all .jpg/.jpeg/.png files under ../public
 * 2. Converts each to .webp using Canvas API or child_process
 * 3. Keeps original files intact
 * 4. Optionally updates code references (can be disabled)
 *
 * Requirements: Node.js with canvas support OR ImageMagick/cwebp installed
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const SCRIPT_DIR = __dirname
const IMAGE_DIR = path.resolve(SCRIPT_DIR, '../public')
const SRC_DIR = path.resolve(SCRIPT_DIR, '../src')
const UPDATE_REFERENCES = false // Set to true if you want to update code references

/**
 * Recursively get all files with specific extensions
 */
function getAllFiles(dir, extensions = ['.jpg', '.jpeg', '.png']) {
  const files = []

  function traverse(currentDir, depth = 0) {
    try {
      const items = fs.readdirSync(currentDir)
      const indent = '  '.repeat(depth)

      if (depth === 0) {
        console.log(`📁 Scanning: ${currentDir}`)
      } else {
        console.log(`${indent}📂 ${path.basename(currentDir)}/`)
      }

      for (const item of items) {
        const fullPath = path.join(currentDir, item)

        try {
          const stat = fs.statSync(fullPath)

          if (stat.isDirectory()) {
            // Skip common non-image directories for performance
            const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build']
            if (!skipDirs.includes(item)) {
              traverse(fullPath, depth + 1)
            } else {
              console.log(`${indent}  ⏭️  Skipping: ${item}/`)
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase()
            if (extensions.includes(ext)) {
              files.push(fullPath)
              console.log(`${indent}  🖼️  Found: ${item}`)
            }
          }
        } catch (statErr) {
          console.warn(`${indent}  ⚠️  Cannot access: ${item}`)
        }
      }
    } catch (err) {
      console.warn(`⚠️  Cannot read directory: ${currentDir} - ${err.message}`)
    }
  }

  traverse(dir)
  return files
}

/**
 * Check if WebP version already exists with detailed logging
 */
function webpExists(imagePath) {
  const parsed = path.parse(imagePath)
  const webpPath = path.join(parsed.dir, parsed.name + '.webp')

  const exists = fs.existsSync(webpPath)

  if (exists) {
    try {
      const originalStat = fs.statSync(imagePath)
      const webpStat = fs.statSync(webpPath)
      const originalSize = (originalStat.size / 1024).toFixed(1)
      const webpSize = (webpStat.size / 1024).toFixed(1)
      const savings = (((originalStat.size - webpStat.size) / originalStat.size) * 100).toFixed(1)

      console.log(
        `⏭️  WebP exists: ${parsed.name}.webp (${originalSize}KB → ${webpSize}KB, ${savings}% smaller)`
      )
    } catch (err) {
      console.log(`⏭️  WebP exists: ${parsed.name}.webp`)
    }
  }

  return { exists, webpPath }
}
/**
 * Convert image to WebP using available method
 */
async function convertToWebP(inputPath, outputPath) {
  const parsed = path.parse(inputPath)

  // Method 1: Try using cwebp (Google's WebP encoder)
  try {
    execSync(`cwebp -q 90 "${inputPath}" -o "${outputPath}"`, { stdio: 'pipe' })
    const originalSize = (fs.statSync(inputPath).size / 1024).toFixed(1)
    const webpSize = (fs.statSync(outputPath).size / 1024).toFixed(1)
    const savings = (
      ((fs.statSync(inputPath).size - fs.statSync(outputPath).size) / fs.statSync(inputPath).size) *
      100
    ).toFixed(1)
    console.log(
      `✅ cwebp: ${parsed.base} → ${parsed.name}.webp (${originalSize}KB → ${webpSize}KB, ${savings}% savings)`
    )
    return true
  } catch (err) {
    // cwebp not available, try next method
  }

  // Method 2: Try using ImageMagick
  try {
    execSync(`magick "${inputPath}" "${outputPath}"`, { stdio: 'pipe' })
    const originalSize = (fs.statSync(inputPath).size / 1024).toFixed(1)
    const webpSize = (fs.statSync(outputPath).size / 1024).toFixed(1)
    console.log(
      `✅ ImageMagick: ${parsed.base} → ${parsed.name}.webp (${originalSize}KB → ${webpSize}KB)`
    )
    return true
  } catch (err) {
    // ImageMagick not available, try next method
  }

  // Method 3: Try using FFmpeg
  try {
    execSync(`ffmpeg -i "${inputPath}" -y "${outputPath}"`, { stdio: 'pipe' })
    const originalSize = (fs.statStats(inputPath).size / 1024).toFixed(1)
    const webpSize = (fs.statSync(outputPath).size / 1024).toFixed(1)
    console.log(
      `✅ FFmpeg: ${parsed.base} → ${parsed.name}.webp (${originalSize}KB → ${webpSize}KB)`
    )
    return true
  } catch (err) {
    // FFmpeg not available
  }

  // Method 4: Try Node.js canvas (if available)
  try {
    const { createCanvas, loadImage } = require('canvas')
    const image = await loadImage(inputPath)
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)

    const buffer = canvas.toBuffer('image/webp', { quality: 0.9 })
    fs.writeFileSync(outputPath, buffer)
    const originalSize = (fs.statSync(inputPath).size / 1024).toFixed(1)
    const webpSize = (buffer.length / 1024).toFixed(1)
    console.log(
      `✅ Canvas: ${parsed.base} → ${parsed.name}.webp (${originalSize}KB → ${webpSize}KB)`
    )
    return true
  } catch (err) {
    // Canvas not available
  }

  return false
}

/**
 * Update file references from old extensions to .webp
 */
function updateCodeReferences() {
  if (!UPDATE_REFERENCES) {
    console.log('📝 Skipping code reference updates (disabled)')
    return
  }

  console.log(`\n🔍 Scanning for code files under: ${SRC_DIR}`)

  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json']
  const codeFiles = getAllFiles(SRC_DIR, codeExtensions)

  console.log(`✅ Found ${codeFiles.length} code file(s) to inspect`)

  // Regex to match image extensions with optional query/hash
  const extRegex = /\.(jpe?g|png)(\?[^'"\)\s]*)?(#[^'"\)\s]*)?/gi

  let updatedCount = 0

  for (const filePath of codeFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const updated = content.replace(extRegex, (match, ext, query = '', hash = '') => {
        return `.webp${query}${hash}`
      })

      if (updated !== content) {
        fs.writeFileSync(filePath, updated, 'utf8')
        console.log(`✏️  Updated: ${path.relative(process.cwd(), filePath)}`)
        updatedCount++
      }
    } catch (err) {
      console.error(`❌ Failed to update "${filePath}":`, err.message)
    }
  }

  console.log(`\n📝 Updated references in ${updatedCount} file(s)`)
}

/**
 * Main conversion process
 */
async function main() {
  console.log('🚀 Starting WebP conversion process...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`📁 Source directory: ${SRC_DIR}\n`)

  // Check if image directory exists
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`❌ Image directory not found: ${IMAGE_DIR}`)
    process.exit(1)
  }

  // Find all image files
  console.log('🔍 Scanning for images...')
  const imageFiles = getAllFiles(IMAGE_DIR)
  console.log(`✅ Found ${imageFiles.length} image(s) to convert\n`)

  if (imageFiles.length === 0) {
    console.log('ℹ️  No images found to convert')
    return
  }

  // Convert each image
  let successCount = 0
  let skipCount = 0
  let errorCount = 0
  let totalSavings = 0

  console.log('\n🔄 Starting conversion process...\n')

  for (const imagePath of imageFiles) {
    const parsed = path.parse(imagePath)
    const relativePath = path.relative(IMAGE_DIR, imagePath)

    console.log(`\n📝 Processing: ${relativePath}`)

    // Enhanced WebP existence check
    const { exists, webpPath } = webpExists(imagePath)

    if (exists) {
      skipCount++
      continue
    }

    try {
      const success = await convertToWebP(imagePath, webpPath)

      if (success) {
        successCount++

        // Calculate space savings
        try {
          const originalSize = fs.statSync(imagePath).size
          const webpSize = fs.statSync(webpPath).size
          const savings = originalSize - webpSize
          totalSavings += savings
        } catch (err) {
          // Silent fail on size calculation
        }
      } else {
        console.log(`❌ Failed: ${parsed.base} (no converter available)`)
        errorCount++
      }
    } catch (err) {
      console.error(`❌ Error converting "${parsed.base}":`, err.message)
      errorCount++
    }
  }

  // Enhanced Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 CONVERSION SUMMARY')
  console.log('='.repeat(50))
  console.log(`📈 Total images found: ${imageFiles.length}`)
  console.log(`✅ Successfully converted: ${successCount}`)
  console.log(`⏭️  Skipped (already exist): ${skipCount}`)
  console.log(`❌ Failed: ${errorCount}`)

  if (totalSavings > 0) {
    const savingsKB = (totalSavings / 1024).toFixed(1)
    const savingsMB = (totalSavings / (1024 * 1024)).toFixed(2)
    console.log(`💾 Total space savings: ${savingsKB} KB (${savingsMB} MB)`)
  }

  const successRate =
    imageFiles.length > 0 ? (((successCount + skipCount) / imageFiles.length) * 100).toFixed(1) : 0
  console.log(`📊 Success rate: ${successRate}%`)
  console.log('='.repeat(50))

  // Update code references if enabled
  if (UPDATE_REFERENCES && successCount > 0) {
    updateCodeReferences()
  }

  console.log('\n🎉 WebP conversion process completed!')

  if (errorCount > 0) {
    console.log('\n💡 To fix conversion errors, install one of these tools:')
    console.log('   • cwebp: https://developers.google.com/speed/webp/download')
    console.log('   • ImageMagick: https://imagemagick.org/script/download.php')
    console.log('   • FFmpeg: https://ffmpeg.org/download.html')
    console.log('   • Node canvas: npm install canvas')
  }
}

// Handle errors gracefully
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err.message)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err.message)
  process.exit(1)
})

// Run the script
main().catch((err) => {
  console.error('❌ Script failed:', err.message)
  process.exit(1)
})
