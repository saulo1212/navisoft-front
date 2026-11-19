export const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';
const detailSegment = 'detalhe';

export function detailHref(collection, id, param = 'uid') {
  const value = encodeURIComponent(id);
  return staticExport ? `${collection}/${detailSegment}/?${param}=${value}` : `${collection}/${value}`;
}

export function staticDetailParams(param) {
  return staticExport ? [{ [param]: detailSegment }] : [];
}
