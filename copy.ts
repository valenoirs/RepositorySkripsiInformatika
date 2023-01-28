import fs from 'fs-extra'

fs.copySync('./src/views', './build/views')
fs.copySync('./src/public', './build/public')
