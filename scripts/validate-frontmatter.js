const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

let checked = 0
let failed = 0

function validateDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      validateDirectory(file)
    } else if (/\.mdx?$/.test(entry.name)) {
      checked += 1
      try {
        matter(fs.readFileSync(file, 'utf8'))
      } catch (error) {
        failed += 1
        console.error(`${file}: ${error.message}`)
      }
    }
  }
}

validateDirectory(path.join(process.cwd(), 'data'))
console.log(`Frontmatter: ${checked} files checked, ${failed} errors`)
process.exitCode = failed ? 1 : 0
