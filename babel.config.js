module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    [
      'component',
      {
        'libraryName': 'xm-mui',
        'style': true
      },
      'xm-mui'
    ],
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      },
      'element-ui'
    ]
  ]
}
