import { ESize } from "../Helpers/UIsize.enum";
import { IUISingleSelectOptionProps } from "./components/UISingleSelectOption/UISingleSelectOption.type";
import { IUISingleSelectSelectedProps } from "./components/UISingleSelectSelected/UISingleSelectSelected.type";

export type IUISingleSelectSize =
  | ESize.S
  | ESize.M
  | ESize.L
  | ESize.XL;

export interface IUISingleSelectProps<T> {
  options: T[];
  placeholder?: string;
  selected?: T;
  onChange: (value: T) => void;
  bindLabel?: keyof T;
  bindValue?: keyof T;
  renderOption: (option: IUISingleSelectOptionProps<T>) => React.ReactNode;
  renderSelected?: (option: IUISingleSelectSelectedProps<T>) => React.ReactNode;
  size?: IUISingleSelectSize;
  className?: React.ComponentProps<"div">["className"];
  disabled?: boolean;
  isInvalid?: boolean;
  classNameState?: {
    default?: React.ComponentProps<"div">["className"];
    active?: React.ComponentProps<"div">["className"];
    error?: React.ComponentProps<"div">["className"];
    disabled?: React.ComponentProps<"div">["className"];
  };
}

