'use client';

import { OperationField } from './OperationalUi';

export default function DriverFields({ value, onChange }) {
  const change = field => event => onChange({ ...value, [field]: event.target.value });
  return <>
    <OperationField label="Nome" required value={value.name ?? ''} onChange={change('name')} />
    <OperationField label="Data de nascimento (opcional)" type="date"
      value={value.birth_date ?? ''} onChange={change('birth_date')} />
    <OperationField label="Número do contrato interno (opcional)"
      value={value.internal_contract_number ?? ''} onChange={change('internal_contract_number')} />
  </>;
}
