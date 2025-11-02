import { UIFormControlComponent, UIFormControlLabelProps } from './UIFormControl.type';
import { UIFormControlBase } from './UIFormControlBase';
import { UIFormControlErrorMessage } from './UIFormControlErrorMessage';
import { UIFormControlLabel } from './UIFormControlLabel';

const FormControl = UIFormControlBase as UIFormControlComponent;
FormControl.Label = UIFormControlLabel as (props: UIFormControlLabelProps) => React.ReactElement;
FormControl.ErrorMessage = UIFormControlErrorMessage;

const UIFormControl = FormControl;

export { UIFormControl };

