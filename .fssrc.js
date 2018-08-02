// vim: set ft=javascript fdm=marker et ff=unix tw=80 sw=2:
// author: allex_wang <http://iallex.com>

import path from 'path'
import babel from 'rollup-plugin-babel'

const { version, name, author, license, dependencies } = require('./package.json')

const banner = (name, short = false) => {
  let s;
  if (short) {
    s = `/*! ${name} v${version} | ${license} Licensed | ${author} */`
  } else {
    s = `/**
 * ${name} v${version}
 *
 * Released under the ${license} license.
 */`
  }
  return s
}

const babelConfig = {
  presets: [
    ['@babel/preset-env', {
      'loose': true,
      'modules': false,
      'useBuiltIns': false,
      'targets': {
        browsers: [ 'last 2 versions', 'not ie <= 8' ]
      }
    }]
  ],
  plugins: [
    '@babel/plugin-external-helpers',
    'transform-decorators-legacy',
    [ '@babel/plugin-transform-runtime', {
      'helpers': false,
      'polyfill': false,
      'regenerator': true,
      'moduleName': '@babel/runtime'
    } ]
  ],
  externalHelpers: true,
  runtimeHelpers: true,
  babelrc: false,
  comments: false
}

module.exports = {
  rollup: {
    destDir: path.join(__dirname, './lib'),
    dependencies: dependencies,
    plugins: {
      babel: (rollupCfg) => {
        const babelrc = Object.assign({}, babelConfig)
        if ([ 'es', 'cjs' ].includes(rollupCfg.output.format)) {
          babelrc.comments = true
        }
        return babelrc
      }
    },
    entry: [ {
      input: 'src/index.js',
      plugins: [
        babel,
        'resolve',
        'commonjs'
      ],
      targets: [
        {
          format: 'umd',
          name: 'UA',
          file: 'index.js',
          minimize: true,
          banner: banner(name)
        },
        {
          format: 'es',
          file: 'index.esm.js',
          banner: banner(name, true)
        }
      ]
    } ]
  }
}
