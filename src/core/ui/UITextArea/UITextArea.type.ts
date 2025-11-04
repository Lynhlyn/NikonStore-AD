import { FormControlState } from '../UIFormControl/UIFormControl.type';
import { ESize } from '../Helpers/UIsize.enum';

export type UITextAreaSize = ESize.S | ESize.M | ESize.L | ESize.XL | ESize.XS;

export type UITextAreaState = FormControlState & {
    isFocused?: boolean;
};

export interface IUITextAreaProps
    extends React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
    >,
    UITextAreaState {
    ref?: React.Ref<HTMLTextAreaElement>;
    textFieldSize?: UITextAreaSize;
    placeholder?: string;
    clearable?: boolean;
    isDisabled?: boolean;
    showCountCharacter?: boolean;
    isShowFocusBorder?: boolean;
    isBlurOnSubmit?: boolean;
    classNameItem?: string;
}

