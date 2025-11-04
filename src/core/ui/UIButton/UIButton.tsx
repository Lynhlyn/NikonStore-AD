import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ESize } from "../Helpers/UIsize.enum";
import { IUIButtonProps } from "./UIButton.type";

const UIButton: React.FC<IUIButtonProps> = (props) => {
    const {
        children,
        isDisabled,
        className,
        isLoading,
        size = ESize.M,
        ...rest
    } = props;

    const sizeButtonClass = {
        [ESize.S]: 'px-[8px] py-[4px]',
        [ESize.M]: 'px-[12px] py-[8px]',
        [ESize.L]: 'px-[6px] py-[8px]',
        [ESize.XL]: 'px-[16px] py-[12px]',
    }[size];

    const buttonClass = twMerge(
        clsx(
            `flex justify-center items-center rounded-sm border-1`,
            sizeButtonClass,
            'bg-bgPrimarySolidDefault text-white focus:outline-none focus:ring-1 focus:ring-opacity-50',
            className,
            {
                'bg-bgPrimarySolidDefault': isDisabled,
                'bg-bgPrimarySolidFocus': !isDisabled,
            },
            {
                'hover:bg-bgPrimarySolidHover': !isDisabled,
                'focus:ring-primary': !isDisabled,
            },
            className
        )
    );

    return (
        <button
            disabled={isDisabled || isLoading}
            {...rest}
            className={buttonClass}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
}
export { UIButton };
