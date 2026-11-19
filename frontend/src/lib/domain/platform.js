import { nonnegative, requiredText } from './technicalOperations';

export const FIPE_SYNC_TYPES = {
  catalog_sync: 'Sincronizar catálogo',
  reference_sync: 'Sincronizar referências',
  variant_refresh: 'Atualizar uma variante'
};

export const FIPE_VEHICLE_TYPES = { cars: 'Carros', motorcycles: 'Motos', trucks: 'Caminhões' };

export function fipeSyncBody(form) {
  const jobType = form.job_type;
  if (!Object.hasOwn(FIPE_SYNC_TYPES, jobType)) throw new Error('Selecione um tipo de sincronização FIPE válido.');
  if (jobType !== 'variant_refresh') return { job_type: jobType, payload: {} };
  if (!Object.hasOwn(FIPE_VEHICLE_TYPES, form.vehicle_type)) throw new Error('Selecione uma categoria de veículo válida.');
  const modelYear = nonnegative(form.model_year, 'Ano do modelo', true);
  const fuelCode = nonnegative(form.fuel_code, 'Código de combustível', true);
  if (!modelYear || !fuelCode) throw new Error('Use valores positivos para ano e combustível.');
  return {
    job_type: jobType,
    payload: {
      vehicle_type: form.vehicle_type,
      source_brand_code: requiredText(form.source_brand_code, 'o código FIPE da marca'),
      source_model_code: requiredText(form.source_model_code, 'o código FIPE do modelo'),
      model_year: modelYear,
      fuel_code: fuelCode
    }
  };
}

export const PLATFORM_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/gif'];

export function validatePlatformLogo(file) {
  if (!file?.size || !PLATFORM_LOGO_TYPES.includes(file.type)) throw new Error('Selecione uma imagem PNG, JPEG ou GIF.');
}
