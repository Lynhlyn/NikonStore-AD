import { IUISingleSelectSize } from "../../UISingleSelect.type";

export interface IUISingleSelectOptionProps<T> {
  option: T;
  bindLabel?: keyof T;
  bindValue?: keyof T;
  isSelected?: boolean;
  onClick?: (option: T) => void;
  className?: React.ComponentProps<"div">["className"];
  isDisabled?: boolean;
  isHighlighted?: boolean;
  size?: IUISingleSelectSize;
}

