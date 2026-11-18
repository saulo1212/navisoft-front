'use client';

import { toast } from 'react-toastify';
import { errorMessage } from '@/lib/api/errors';

// Wrappers de notificação. Centralizam o uso do react-toastify (ToastContainer
// já montado em AppWrapper) e traduzem ApiError em mensagem legível.

export function notifySuccess(message) {
  toast.success(message);
}

export function notifyInfo(message) {
  toast.info(message);
}

export function notifyWarning(message) {
  toast.warning(message);
}

// Aceita um ApiError, um Error genérico ou uma string.
export function notifyError(errorOrMessage) {
  const message = typeof errorOrMessage === 'string' ? errorOrMessage : errorMessage(errorOrMessage);
  toast.error(message);
}

export { toast };
