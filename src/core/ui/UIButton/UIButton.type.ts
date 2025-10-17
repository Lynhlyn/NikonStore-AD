import { ESize } from "../Helpers/UIsize.enum";

export type TUIButtonSize = ESize.S | ESize.M | ESize.L | ESize.XL;

export interface IUIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode | string;
    size?: TUIButtonSize;
    isDisabled?: boolean;
    isLoading?: boolean;
}
