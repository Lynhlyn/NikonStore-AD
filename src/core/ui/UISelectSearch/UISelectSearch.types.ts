import { ESize } from "../Helpers/UIsize.enum";

export interface SelectOption {
  value: string | number;
  label: string;
  data?: any;
}

export type UISelectSearchSize =
  | ESize.S
  | ESize.M
  | ESize.L
  | ESize.XL;

export interface UISelectSearchProps {
  placeholder?: string;
  value?: SelectOption | SelectOption[];
  multiple?: boolean;
  disabled?: boolean;
  searchable?: boolean;

  options: SelectOption[];
  loading?: boolean;
  onSearch?: (query: string) => void;

  onChange: (value: SelectOption | SelectOption[] | null) => void;
  onCreateNew?: (query: string) => void;

  maxDisplayTags?: number;
  showCreateButton?: boolean;
  createButtonText?: string;
  noDataText?: string;

  size?: UISelectSearchSize;
  className?: string;
  containerClassName?: string;
}

