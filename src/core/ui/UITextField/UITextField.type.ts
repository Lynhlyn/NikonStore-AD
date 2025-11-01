import { FormControlState } from '../UIFormControl/UIFormControl.type';
import { ESize } from '../Helpers/UIsize.enum';

export type UITextFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color'
  | 'file'
  | 'hidden'
  | 'image'
  | 'reset'
  | 'submit'
  | 'button'
  | 'checkbox'
  | 'radio'
  | 'range'
  | 'select'
  | 'textarea';

export type UITextFieldSize = ESize.S | ESize.M | ESize.L | ESize.XL | ESize.XS | ESize.XXL;

export type UITextFieldState = FormControlState & {
  isFocused?: boolean;
};

export interface IUITextFieldProps
  extends React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    UITextFieldState {
  ref?: React.Ref<HTMLInputElement>;
  type?: UITextFieldType;
  textFieldSize?: UITextFieldSize;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  isDisabled?: boolean;
  showCountCharacter?: boolean;
  isShowFocusBorder?: boolean;
  isBlurOnSubmit?: boolean;
  maxLength?: number;
  showPasswordToggle?: boolean;
}

