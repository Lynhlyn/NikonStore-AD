'use client';

import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { mergeRefs } from '@/common/utils/ref';
import { ESize } from '../Helpers/UIsize.enum';
import { IUITextAreaProps } from './UITextArea.type';
import { X } from 'lucide-react';

const textFieldSizeMap = {
    [ESize.XS]: 'px-[6px] py-[4px]',
    [ESize.S]: 'px-[14px] py-[8px]',
    [ESize.M]: 'px-[14px] py-[10px]',
    [ESize.L]: 'px-[16px] py-[12px]',
    [ESize.XL]: 'px-[18px] py-[14px]',
};

const resolveStateFactory = {
    default: 'bg-white border border-gray-300 rounded-md',
    active: 'bg-white border-2 border-blue-500 ring-2 ring-blue-200 rounded-md',
    error: 'bg-white border-2 border-red-500 ring-2 ring-red-200 rounded-md',
    disabled: 'bg-gray-50 border-gray-200 rounded-md',
};

const UITextArea: React.FC<IUITextAreaProps> = (props) => {
    const {
        ref,
        textFieldSize = ESize.M,
        placeholder,
        clearable = true,
        isFocused: isFocusedProp,
        isInvalid = false,
        isDisabled,
        value,
        className,
        classNameItem,
        onChange,
        onFocus,
        onBlur,
        ...rest
    } = props;

    const _ref = React.useRef<HTMLTextAreaElement>(null);
    const mergedRef = mergeRefs([_ref, ref as React.LegacyRef<HTMLTextAreaElement>]);
    const [isFocused, setIsFocused] = React.useState(isFocusedProp);

    const wrapperClass = twMerge(
        clsx(
            'w-full flex gap-2 rounded-md justify-center items-start',
            textFieldSizeMap[textFieldSize],
            resolveStateFactory.default,
            className,
            isFocused && resolveStateFactory.active,
            isInvalid && resolveStateFactory.error,
            isDisabled && resolveStateFactory.disabled
        )
    );

    const textAreaClass = twMerge(
        clsx(
            'w-full resize-none bg-transparent focus:outline-none text-gray-900 font-normal text-sm',
            {
                'text-gray-400': isDisabled,
            }
        )
    );

    const handleClear = () => {
        if (_ref.current) {
            _ref.current.value = '';
            onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>);
            setIsFocused(true);
            _ref.current.focus();
        }
    };

    const shouldDisplayClearButton = Boolean(
        value?.toString()?.length && clearable && !isDisabled
    );

    const handleFocus = (
        isFocus: boolean,
        event: React.FocusEvent<HTMLTextAreaElement>,
        callBack?: (event: React.FocusEvent<HTMLTextAreaElement>) => void,
    ) => {
        setIsFocused(isFocus);
        if (typeof callBack === 'function') callBack(event);
    };

    return (
        <div className={wrapperClass}>
            <textarea
                ref={mergedRef}
                placeholder={placeholder}
                disabled={isDisabled}
                className={`${textAreaClass} ${classNameItem || ''}`}
                aria-invalid={isInvalid}
                aria-disabled={isDisabled}
                onFocus={(e) => handleFocus(true, e, onFocus)}
                onBlur={(e) => handleFocus(false, e, onBlur)}
                value={value}
                onChange={onChange}
                {...rest}
            />
            {shouldDisplayClearButton && (
                <button onClick={handleClear} type="button" className="flex-shrink-0 mt-1">
                    <X size={16} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                </button>
            )}
        </div>
    );
};

export { UITextArea };

