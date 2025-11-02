export type UIFromControlProps = {
    children?: any;
    isReadOnly?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
    className?: React.ComponentProps<"div">["className"];
  };
  
  export type UIFormControlLabelProps = UIFromControlProps & {
    isRequired?: boolean;
    className?: React.ComponentProps<"span">["className"];
  };
  export type UIFormControlErrorMessageProps = UIFromControlProps & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };
  
  export type UIFormControlComponent = ((
    props: UIFromControlProps,
  ) => JSX.Element) & {
    Label: (props: UIFormControlLabelProps) => JSX.Element;
    ErrorMessage: (
      props: UIFormControlErrorMessageProps,
    ) => JSX.Element | null;
  };
  
  export type FormControlState = {
    isInvalid?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
  };

