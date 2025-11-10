'use client';

import { VoucherForm } from "./components/VoucherForm";

export interface IVoucherProps {
    id?: number;
    isViewMode?: boolean;
}

const VoucherFormPage: React.FC<IVoucherProps> = ({ id, isViewMode }) => {
    return (
        <div className="pt-[50px] px-[50px]">
            <div className="mb-[25px] text-2xl leading-[155%] font-normal">
                <span>
                    {isViewMode ? 'Xem voucher' : id ? 'Chỉnh sửa voucher' : 'Thêm voucher'}
                </span>
            </div>
            <VoucherForm id={id} isViewMode={isViewMode} />
        </div>
    );
};

export default VoucherFormPage;

