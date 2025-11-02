import clsx from "clsx";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";
import type { UIFormControlLabelProps } from "./UIFormControl.type";
 
const UIFormControlLabel: React.FC<UIFormControlLabelProps> = (props) => {
  const { children, isRequired = false, className } = props;
 
  const lableClassName = twMerge(clsx("font-base text-sm", className));
 
  const isString = typeof children === "string";
 
  return (
    <Fragment>
      {isString ? (
        <span className={lableClassName}>
          {children} {isRequired && <span className="text-[#F50707]">*</span>}
        </span>
      ) : (
        children
      )}
    </Fragment>
  );
};
 
export { UIFormControlLabel };

