/* eslint @typescript-eslint/no-var-requires: "off" */

if (typeof Buffer === 'undefined') global.Buffer = require('buffer/').Buffer

if (typeof process === 'undefined') {
  global.process = require('process')
} else {
  const bProcess = require('process')
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p]
    }
  }
}
