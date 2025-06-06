/**
 * webp-if-missing.js  (non-destructive converter)
 *
 * Usage:
 *   cd ~/Desktop/RobotRic/robotric
 *   node scripts/webp-if-missing.js
 *
 * What it does
 * 1. Scans ../public recursively for .jpg/.jpeg/.png.
 * 2. For each image, checks whether `${basename}.webp` exists in the same dir.
 * 3. If the .webp is missing, creates it (lossless, quality = 100, strip metadata).
 * 4. Leaves originals exactly as-is and does **not** touch anything in ../src.
 *
 * Requires: fast-glob  sharp  (   npm i -D fast-glob sharp   )
 */

const fs = require('fs').promises
const path = require('path')
const fg = require('fast-glob')
const sharp = require('sharp')

;(async () => {
  // ——— Configuration ———
  const SCRIPT_DIR = __dirname // same as before
  const IMAGE_DIR = path.resolve(SCRIPT_DIR, '../public')

  console.log(`\n🔍  Searching for JPEG/PNG assets under:\n    ${IMAGE_DIR}\n`)

  // 1️⃣  Discover all candidate images
  const patterns = [
    `${IMAGE_DIR.replace(/\\/g, '/')}/**/*.jpg`,
    `${IMAGE_DIR.replace(/\\/g, '/')}/**/*.jpeg`,
    `${IMAGE_DIR.replace(/\\/g, '/')}/**/*.png`,
  ]
  const originals = await fg(patterns, { onlyFiles: true })

  console.log(`📸  Found ${originals.length} file(s).\n`)

  let convertedCount = 0
  for (const originalPath of originals) {
    const { dir, name, base } = path.parse(originalPath)
    const webpPath = path.join(dir, `${name}.webp`)

    // 2️⃣  Skip if WebP already present
    try {
      await fs.access(webpPath)
      console.log(`⏭️  Exists → skipped: ${path.relative(IMAGE_DIR, base)}`)
      continue
    } catch {
      /* file doesn’t exist – continue */
    }

    // 3️⃣  Convert
    try {
      await sharp(originalPath).webp({ quality: 100, lossless: true }).toFile(webpPath)

      console.log(`✅  Created: ${path.relative(IMAGE_DIR, webpPath)}`)
      convertedCount++
    } catch (err) {
      console.error(`❌  Failed on ${base}:`, err)
    }
  }

  console.log(
    `\n🎉  Finished. ${convertedCount} new WebP image(s) generated.\n` +
      `🚫  No originals were altered and no source files were touched.`
  )
})()
