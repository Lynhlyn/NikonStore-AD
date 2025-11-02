import React, { createContext, useContext } from 'react';
import type { FormControlState } from './UIFormControl.type';

type FormControlContextValue<T extends FormControlState = FormControlState> = T;

const FormControlContext = createContext<FormControlContextValue>({});

export const useFormControlProvider = <T extends FormControlState>(
  props: T
): FormControlContextValue<T> => {
  return props;
};

export const useFormControl = <T extends FormControlState = FormControlState>(): FormControlContextValue<T> => {
  return useContext(FormControlContext) as FormControlContextValue<T>;
};

export { FormControlContext };

