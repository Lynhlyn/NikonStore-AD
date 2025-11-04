import { ChevronDown } from "lucide-react";
import { IUISingleSelectSelectedProps } from "./UISingleSelectSelected.type";

const UISingleSelectSelected = <T,>(props: IUISingleSelectSelectedProps<T>) => {
    const {
        selected,
        bindLabel = "label" as keyof T,
        bindValue = "value" as keyof T,
        placeholder,
        isCollapsed,
        iconClassName,
        labelClassName
    } = props;
    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex flex-1 min-w-0">
                <span className={`${labelClassName} text-sm leading-[170%] truncate`}>
                    {selected ? (selected[bindLabel as keyof NonNullable<T>] as string) : <span className="text-gray-400">{placeholder}</span>}
                </span>
            </div>
            <div
                className={`flex items-center transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""} ${iconClassName || ""}`}
            >
                <ChevronDown width={18} height={18} className="text-gray-500 flex-shrink-0" />
            </div>
        </div>
    )
}

export { UISingleSelectSelected };

