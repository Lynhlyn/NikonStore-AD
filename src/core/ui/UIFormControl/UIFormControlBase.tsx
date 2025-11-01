import React from 'react';
import { UIFromControlProps } from './UIFormControl.type';
import { FormControlContext, useFormControlProvider } from './useFormControl';

const UIFormControlBase = (props: UIFromControlProps) => {
  const context = useFormControlProvider<UIFromControlProps>(props);
  const { children, className } = props;
  return (
    <FormControlContext.Provider value={context}>
      <div className={`flex w-full gap-[10px] flex-col ${className}`}>
        {children}
      </div>
    </FormControlContext.Provider>
  );
};

export { UIFormControlBase };

