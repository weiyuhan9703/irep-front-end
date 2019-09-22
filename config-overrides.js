const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#1e88e5',
      '@link-color': '#1e88e5',
      '@success-color': '#5cb85c',
      '@warning-color': '#f0ad4e',
      '@error-color': '#ef4836',
      '@font-size-base': '14px',
      '@heading-color': '#333',
      '@text-color': '#333',
      '@text-color-secondary': '#666',
      '@disabled-color': '#d1d1d1',
      '@border-radius-base': '4px',
      '@border-color-base': '#e0e0e0',
      '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)'
    }
  })
)
