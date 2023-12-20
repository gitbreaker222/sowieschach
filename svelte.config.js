import * as child_process from 'node:child_process';
import pkg from './package.json' assert { type: 'json' };
import adapter from '@sveltejs/adapter-netlify';

export default {
  kit: {
    // default options are shown
    adapter: adapter({
      // if true, will create a Netlify Edge Function rather
      // than using standard Node-based functions
      edge: false,

      // if true, will split your app into multiple functions
      // instead of creating a single one for the entire app.
      // if `edge` is true, this option cannot be used
      split: false
    }),
    version: {
      name: pkg.version + '_' + child_process.execSync('git rev-parse HEAD').toString().trim()
    }
  }
};
