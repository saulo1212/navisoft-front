'use client';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa6';

export default function NewButton({ label, className, title = label, ...props }) {
  return (
    <Button {...props} className={clsx('d-inline-flex align-items-center gap-2', className)} aria-label={label} title={title}>
      <FaPlus aria-hidden="true" />
      Novo
    </Button>
  );
}
