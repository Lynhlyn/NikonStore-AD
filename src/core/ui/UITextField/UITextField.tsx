import { ESize } from "../Helpers/UIsize.enum";
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IUITextFieldProps } from "./UITextField.type";
import React from "react";
import { mergeRefs } from "@/common/utils/ref";
import { Eye, EyeClosed } from "lucide-react";

const UITextField: React.FC<IUITextFieldProps> = (props) => {
  const {
    ref,
    type = 'text',
    textFieldSize = ESize.M,
    placeholder,
    leftIcon,
    rightIcon,
    clearable = true,
    isFocused: isFocusedProp,
    value,
    isInvalid = false,
    isDisabled,
    className,
    maxLength,
    showPasswordToggle = true,
    ...rest
  } = props;

  const _ref = React.useRef<HTMLInputElement>(null);
  const mergedRef = mergeRefs([_ref, ref as React.LegacyRef<HTMLInputElement>]);
  const [isFocused, setIsFocused] = React.useState(isFocusedProp);
  const [typeInput, setTypeInput] = React.useState(type);

  const isPasswordType = type === 'password';

  const textFieldSizeClass = {
    [ESize.XS]: 'px-[4px] py-[4px]',
    [ESize.S]: 'px-[12px] py-[8px]',
    [ESize.M]: 'px-[12px] py-[12px]',
    [ESize.L]: 'px-[10px] py-[11.3px]',
    [ESize.XL]: 'px-[12px] py-[12px]',
    [ESize.XXL]: 'px-[15px] py-[15px]',
  }[textFieldSize];

  const resolveStateFactory = {
    default: 'bg-white dark:bg-card border-[1px] border-bgNeutralTonalDisable dark:border-border',
    active: 'bg-white dark:bg-card border-[1px] border-bgPrimarySolidFocus dark:border-primary',
    error: 'bg-white dark:bg-card border-[1px] border-bgDangerSolidFocus dark:border-destructive',
    disabled: 'bg-white dark:bg-card',
  };

  const inputStyleWrapper = twMerge(
    clsx(
      'w-full gap-2 flex items-center justify-center focus:outline-none focus:ring-1 rounded-sm',
      textFieldSizeClass,
      resolveStateFactory.default,
      className,
      isFocused && resolveStateFactory.active,
      isInvalid && resolveStateFactory.error,
      isDisabled && resolveStateFactory.disabled
    )
  );

  const inputStyle = twMerge(
    clsx(
      'w-full bg-transparent focus:outline-none text-fgNeutralEmphasis dark:text-foreground font-normal text-sm text-sm leading-[170%]',
      {
        'text-fgNeutralSubtle dark:text-muted-foreground': isDisabled,
      }
    )
  );

  const handleClear = () => {
    if (_ref.current) {
      _ref.current.value = '';
      props.onChange?.({ target: { value: '' } } as any);
      setIsFocused(true);
      _ref.current.focus();
    }
  };

  const handleToggleHide = () => {
    setTypeInput(typeInput === 'password' ? 'text' : 'password');
  };

  const shouldDisplayClearButton = Boolean(
    ['text', 'email'].includes(type) &&
    value?.toString()?.length &&
    clearable &&
    !isDisabled
  );

  const shouldDisplayEyeButton = Boolean(
    showPasswordToggle &&
    isPasswordType &&
    value?.toString()?.length &&
    !isDisabled
  );

  const handleFocus = (
    isFocus: boolean,
    event: any,
    callBack?: (event: any) => void,
  ) => {
    setIsFocused(isFocus);
    typeof callBack === 'function' && callBack(event);
  };
  return (
    <div className={inputStyleWrapper}>
      {leftIcon && <span>{leftIcon}</span>}
      <input
        ref={mergedRef}
        type={typeInput}
        placeholder={placeholder}
        disabled={isDisabled}
        className={inputStyle}
        onFocus={(e) => handleFocus(true, e, rest.onFocus)}
        onBlur={(e) => {
          handleFocus(false, e, rest.onBlur);
          setIsFocused(false);
        }}
        value={value}
        onChange={props.onChange}
        maxLength={maxLength}
        {...rest}
      />
      {shouldDisplayClearButton && (
        <button onClick={handleClear} type="button">
        </button>
      )}
      {shouldDisplayEyeButton && (
        <button type="button" onClick={handleToggleHide}>
          {typeInput === 'password' ? <EyeClosed width={20} /> : <Eye width={20} />}
        </button>
      )}
      {rightIcon && <span>{rightIcon}</span>}
    </div>
  );
};

export { UITextField };

