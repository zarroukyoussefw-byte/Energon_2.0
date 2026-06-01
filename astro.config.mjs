import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function walk(dir, fileList = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      await walk(path.join(dir, file.name), fileList);
    } else if (file.name.endsWith('.html')) {
      fileList.push(path.join(dir, file.name));
    }
  }
  return fileList;
}

function asyncCssIntegration() {
  return {
    name: 'async-css',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const htmlFiles = await walk(outDir);
        for (const file of htmlFiles) {
          let html = await fs.readFile(file, 'utf-8');
          html = html.replace(
            /<link([^>]*rel="stylesheet"[^>]*)>/g,
            (match, p1) => {
              if (match.includes('media="print"')) return match;
              return `<link${p1} media="print" onload="this.media='all'"><noscript><link${p1}></noscript>`;
            }
          );
          await fs.writeFile(file, html);
        }
      }
    }
  };
}

export default defineConfig({
  site: 'https://energon.cloud',
  integrations: [sitemap(), asyncCssIntegration()],
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
