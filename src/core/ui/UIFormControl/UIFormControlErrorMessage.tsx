import { UIFormControlErrorMessageProps } from "./UIFormControl.type";

const UIFormControlErrorMessage = (
    props: UIFormControlErrorMessageProps,
) => {
    const { children,  rightIcon } = props;

    return children ? (
        <div className="flex items-center gap-1">
            <span className="text-[#FF1717] dark:text-destructive flex-shrink font-normal text-sm">{children}</span>
            {rightIcon && rightIcon}
        </div>
    ) : null;
};

export { UIFormControlErrorMessage };

