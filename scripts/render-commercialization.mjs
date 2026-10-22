import { build } from 'esbuild';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Render the actual page at build time so search content follows the visible copy.
export async function renderCommercialization() {
  const root = fileURLToPath(new URL('../', import.meta.url));
  await mkdir(new URL('../tmp/', import.meta.url), { recursive: true });
  const output = fileURLToPath(new URL('../tmp/commercialization-ssr.cjs', import.meta.url));
  const result = await build({
    absWorkingDir: root, bundle: true, platform: 'node', format: 'cjs', write: false,
    plugins: [{ name: 'snapshot-styles', setup(api) { api.onLoad({filter:/\.css$/}, () => ({contents:'export default {}', loader:'js'})); } }], packages: 'external', jsx: 'automatic',
    stdin: { contents: `import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { MemoryRouter } from 'react-router-dom';
      import { HelmetProvider } from 'react-helmet-async';
      import Commercialization from './src/pages/Commercialization/Commercialization.jsx';
      export function render() { return renderToStaticMarkup(React.createElement(HelmetProvider, {context:{}}, React.createElement(MemoryRouter, {initialEntries:['/venture']}, React.createElement(Commercialization)))); }`, resolveDir: root, sourcefile: 'commercialization-ssr.jsx', loader: 'jsx' },
  });
  await writeFile(output, result.outputFiles[0].text);
  try {
    const { render } = await import(pathToFileURL(output).href);
    return render().replace(/\s(?:style|class|data-scroll-fade|data-site-motion-ignore|data-footer-surface)="[^"]*"/g, '').replace(/<link\b[^>]*>/g, '');
  } finally { await unlink(output); }
}
