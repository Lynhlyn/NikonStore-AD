import VoucherFormPage from '@/modules/Voucher/VoucherForm';
import { notFound } from 'next/navigation';

export default function ViewVoucherPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    notFound();
  }
  return <VoucherFormPage id={id} isViewMode={true} />;
}

