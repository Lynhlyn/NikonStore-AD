import { EStatusEnumString } from '@/common/enums/status';

export const getStatusEnumString = () => {
  return [
    { label: 'Hoạt động', value: EStatusEnumString.ACTIVE },
    { label: 'Không hoạt động', value: EStatusEnumString.INACTIVE },
  ];
}

export const getStatusEnumStringWithAll = () => {
  return [
    { label: 'Hoạt động', value: EStatusEnumString.ACTIVE },
    { label: 'Không hoạt động', value: EStatusEnumString.INACTIVE },
    { label: 'Sắp bắt đầu', value: EStatusEnumString.PENDING_START }
  ];
}

