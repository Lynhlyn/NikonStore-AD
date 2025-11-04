import { useMemo } from "react";
import { IUISingleSelectOptionProps } from "./UISingleSelectOption.type";
import { ESize } from "@/core/ui/Helpers/UIsize.enum";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { Check } from "lucide-react";

const UISingleSelectOption = <T,>(props: IUISingleSelectOptionProps<T>) => {
    const {
        option,
        bindLabel = "label" as keyof T,
        bindValue = "value" as keyof T,
        isSelected,
        onClick,
        className,
        isDisabled = false,
        isHighlighted = false,
        size = ESize.M,
    } = props;

    const handleClick = () => {
        if (onClick && !isDisabled) {
            onClick(option);
        }
    };

    const optionSingleSelectStyleWrapper = useMemo(() =>
        twMerge(
            clsx(
                "flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors",
                {
                    [ESize.XS]: "px-[6px] py-[4px]",
                    [ESize.S]: "px-[16px] py-[8px]",
                    [ESize.M]: "px-[14px] py-[10px]",
                    [ESize.L]: "px-[16px] py-[12px]",
                    [ESize.XL]: "px-[18px] py-[14px]",
                }[size],
                className,
                isHighlighted && "bg-slate-100",
                isSelected && "bg-blue-50 text-blue-700",
                isDisabled && "cursor-not-allowed bg-gray-50 hover:bg-gray-50 opacity-50",
            )
        ), [className, size, isHighlighted, isSelected, isDisabled]
    );


    return (
        <div
            className={`${optionSingleSelectStyleWrapper} text-sm leading-[170%]`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
        >
            <span className="truncate flex-1">
                {option && (option[bindLabel as keyof T] as string)}
            </span>
            {
                isSelected && (
                    <Check size={16} className="text-blue-600 flex-shrink-0 ml-2" />
                )
            }
        </div>
    );
}


export { UISingleSelectOption };

