import moduleAlias from 'module-alias'

import * as fs from 'fs'
import * as path from 'path'

const checkPath = path.join(__dirname, '../mods/core/dist')

const modules = fs.existsSync(checkPath)
  ? {
      '@core': path.join(__dirname, '../mods/core/dist'),
      '@client': path.join(__dirname, '../mods/client/dist'),
      '@shared': path.join(__dirname, '../mods/shared/dist'),
      '@networking': path.join(__dirname, '../mods/networking/dist'),
      '@events': path.join(__dirname, '../mods/events/dist'),
      '@serialization': path.join(__dirname, '../mods/serialization/dist'),
      '@sync': path.join(__dirname, '../mods/sync/dist'),
    }
  : {
      '@core': path.join(__dirname, '../../core/dist'),
      '@client': path.join(__dirname, '../../client/dist'),
      '@shared': path.join(__dirname, '../../shared/dist'),
      '@networking': path.join(__dirname, '../../networking/dist'),
      '@events': path.join(__dirname, '../../events/dist'),
      '@serialization': path.join(__dirname, '../../serialization/dist'),
      '@sync': path.join(__dirname, '../../sync/dist'),
    }
moduleAlias.addAliases(modules)
