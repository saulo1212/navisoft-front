import { readFile } from 'node:fs/promises';

const modules = new Map();
async function moduleUrl(url) {
  if (modules.has(url.href)) return modules.get(url.href);
  let source = await readFile(url, 'utf8');
  for (const match of [...source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)]) source = source.replace(match[0], `from '${await moduleUrl(new URL(`${match[1]}.js`, url))}'`);
  const result = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  modules.set(url.href, result);
  return result;
}
export async function importBrowserModule(url) { return import(await moduleUrl(url)); }
