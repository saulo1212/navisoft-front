'use client';

import { Alert } from 'react-bootstrap';

// Modo warn: navegação autorizada normalmente, mas com aviso do período
// retornado pela API. Não suspender consultas de negócio neste modo.
const TemporalBanner = () => (
  <Alert variant="warning" className="rounded-0 mb-0 py-2 text-center small">
    Atenção: sua janela de acesso está próxima do limite configurado para esta organização.
  </Alert>
);

export default TemporalBanner;
