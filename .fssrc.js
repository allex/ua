import path from 'path'
import babel from 'rollup-plugin-babel'
import { version, name, author, license, dependencies } from './package.json'

const banner = (name, short = false) => {
  let s;
  if (short) {
    s = `/*! ${name} v${version} | ${license} licensed | ${author} */`
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
  externalHelpers: true,
  runtimeHelpers: true,
  babelrc: true,
  comments: false
}

export default {
  destDir: path.join(__dirname, './lib'),
  dependencies: dependencies,
  plugins: {
    babel ({ output: { format } }) {
      const babelrc = { ...babelConfig }
      if ([ 'es', 'cjs' ].includes(format)) {
        babelrc.comments = true
      }
      return babelrc
    }
  },
  entry: [
    {
      input: 'src/index.js',
      plugins: [
        [ 'babel', babel ],
        'resolve',
        'commonjs'
      ],
      output: [
        { format: 'umd', name: 'UA', file: 'index.js', minimize: true, banner: banner(name) },
        { format: 'es', file: 'index.esm.js', minimize: true, banner: banner(name, true) }
      ]
    }
  ]
}
