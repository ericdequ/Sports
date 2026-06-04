module.exports = {
  postcssPlugin: 'normalize-print-color-adjust',
  Declaration(decl) {
    if (decl.prop === 'color-adjust') decl.prop = 'print-color-adjust'
  },
}
