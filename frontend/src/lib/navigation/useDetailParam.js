'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { staticExport } from './detailRoutes';

function useStaticDetailParam(name) {
  return useSearchParams().get(name);
}

function useServerDetailParam(name) {
  return useParams()[name];
}

export const useDetailParam = staticExport ? useStaticDetailParam : useServerDetailParam;
