import clsx from "clsx";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ESize } from "../Helpers/UIsize.enum";
import { UISingleSelectOption, UISingleSelectSelected } from "./components";
import { IUISingleSelectProps } from "./UISingleSelect.type";

type UISingleSelectComponent = (<T, >(props: IUISingleSelectProps<T>) => JSX.Element) & {
    Selected: typeof UISingleSelectSelected;
    Option: typeof UISingleSelectOption;
};

const UISingleSelect: UISingleSelectComponent = <T,>(props: IUISingleSelectProps<T>) => {
    const {
        options,
        placeholder,
        selected,
        onChange,
        renderOption,
        renderSelected,
        size = ESize.M,
        className,
        disabled = false,
        bindLabel = "label" as keyof T,
        bindValue = "value" as keyof T,
        isInvalid = false,
        classNameState
    } = props;
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const resolveStateFactory = useMemo(() => ({
        default: clsx("bg-white border border-gray-300", classNameState?.default),
        active: clsx("bg-white border-2 border-blue-500 ring-2 ring-blue-200", classNameState?.active),
        error: clsx("bg-white border-2 border-red-500 ring-2 ring-red-200", classNameState?.error),
        disabled: clsx("bg-gray-50 border-gray-200", classNameState?.disabled),
    }), [classNameState]);

    const singleSelectStyleWrapper = useMemo(() =>
        twMerge(
            clsx(
                "w-full gap-2 flex items-center justify-center relative rounded-md h-[50px]",
                {
                    [ESize.XS]: "px-[6px] py-[4px] h-[32px]",
                    [ESize.S]: "px-[16px] py-[8px] h-[40px]",
                    [ESize.M]: "px-[14px] py-[10px] h-[44px]",
                    [ESize.L]: "px-[16px] py-[12px] h-[50px]",
                    [ESize.XL]: "px-[18px] py-[14px] h-[56px]",
                }[size],
                className,
                resolveStateFactory.default,
                isCollapsed && resolveStateFactory.active,
                isInvalid && resolveStateFactory.error,
                disabled && resolveStateFactory.disabled,
                disabled && "cursor-not-allowed",
            )
        ), [className, size, isCollapsed, isInvalid, disabled, resolveStateFactory]
    );


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCollapsed(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])



    return (
        <div
            ref={dropdownRef}
            onClick={() => !disabled && setIsCollapsed(!isCollapsed)}
            className={singleSelectStyleWrapper}>
            <div className={`flex items-center justify-between w-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                {renderSelected({ selected, bindLabel, bindValue, placeholder, isCollapsed })}
            </div>
            <div
                className={clsx(
                    "border border-gray-200 absolute w-full bg-white rounded-lg top-full mt-1 shadow-lg z-20 transition-all max-h-[300px] overflow-y-auto duration-200 ease-in-out",
                    isCollapsed ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 pointer-events-none invisible",

                )}
                onClick={(e) => e.stopPropagation()}
            >
                {options.map((option, index) => {
                    const isSelected = selected && (selected[bindValue as keyof T] === option[bindValue as keyof T]);
                    const isHighlighted = isCollapsed && (selected && (selected[bindValue as keyof T] === option[bindValue as keyof T]));
                    const disabledOption = (option as any).disabled || false;
                    return (
                        <div key={index} onClick={() => {
                            if (!disabledOption) {
                                onChange(option);
                                setIsCollapsed(false);
                            }
                        }}>
                            {renderOption({
                                option,
                                bindLabel,
                                bindValue,
                                isSelected,
                                isHighlighted,
                                isDisabled: disabledOption,
                                size,
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

UISingleSelect.Selected = UISingleSelectSelected;
UISingleSelect.Option = UISingleSelectOption;

export { UISingleSelect };

