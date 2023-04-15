import fs from 'fs-extra'

fs.copySync('./src/views', './_build/views')
fs.copySync('./src/public', './_build/public')
