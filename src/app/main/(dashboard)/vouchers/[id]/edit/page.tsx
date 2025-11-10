import VoucherFormPage from '@/modules/Voucher/VoucherForm';
import { notFound } from 'next/navigation';

export default function EditVoucherPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    notFound();
  }
  return <VoucherFormPage id={id} />;
}

