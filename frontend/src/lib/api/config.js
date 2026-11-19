// Configuração central da API. Os valores vêm de variáveis NEXT_PUBLIC_*
// (expostas ao browser). Nunca colocar segredos aqui.
//
// Bases conhecidas (do environment do Insomnia_2026-11-04.json):
//   - Homologação (LAN/VPN): http://172.25.73.91:8080   -> `baseURL`
//   - Externa (produção):    https://api.navisoft.app    -> `extURL`
// Escolher a base por ambiente em NEXT_PUBLIC_API_BASE_URL.

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
export const API_CONFIGURED = process.env.NEXT_PUBLIC_STATIC_EXPORT !== '1' || API_BASE_URL.startsWith('https://');

// `application` é obrigatório/implícito no login; o backend assume "navisoft"
// quando vazio. Mantido como constante para uso no fluxo de autenticação.
export const API_APPLICATION = process.env.NEXT_PUBLIC_API_APPLICATION || 'navisoft';

// Paginação: a API de admin usa offset/limit (intervalo 1–100, padrão 50).
export const DEFAULT_LIST_LIMIT = 50;
export const MAX_LIST_LIMIT = 100;

// Bases de referência para troca rápida de ambiente (documentação; o valor
// efetivo é sempre API_BASE_URL acima).
export const KNOWN_BASES = Object.freeze({
  homolog: 'http://172.25.73.91:8080',
  external: 'https://api.navisoft.app'
});
