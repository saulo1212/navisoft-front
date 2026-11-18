// Chave de idempotência para criações. O backend trata POST/PUT de criação como
// idempotentes: repetir a MESMA chave+corpo retorna o mesmo recurso (replay);
// corpo diferente com a mesma chave retorna 409. Gerar a chave UMA vez por
// intenção do usuário (ex.: ao abrir o formulário) e reusá-la nas retentativas.
export function newIdempotencyKey() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback (ambientes sem crypto.randomUUID).
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
