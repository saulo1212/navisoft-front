'use client';

import { OperationField } from './OperationalUi';

export default function DriverFields({ value, onChange, required = false }) {
  const change = field => event => onChange({ ...value, [field]: event.target.value });
  return <>
    <OperationField label="Nome" required value={value.name ?? ''} onChange={change('name')} />
    <OperationField label="Data de nascimento" type="date" required={required}
      value={value.birth_date ?? ''} onChange={change('birth_date')} />
    <OperationField label="Número do contrato interno" required={required}
      value={value.internal_contract_number ?? ''} onChange={change('internal_contract_number')} />
  </>;
}
