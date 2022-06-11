import { useState } from "react";
import { LoginInterface } from "../components/form/Form";
import {LoginErrorsType, LoginRulesType} from "../pages/login";

type useFormProps = LoginInterface;
type rulesType = LoginRulesType;

const useForm = (initialValues: useFormProps, rules?: rulesType) => {
	const [values, setValues] = useState(initialValues);
	const [formErrors, setFormErrors] = useState({} as LoginErrorsType);

	const validateRule = (key: string, value: string, keyRule: Array<any>) => {
		if( keyRule[0] === "required"){
			if( value === "") {
				setFormErrors({...formErrors, [key]: "This field is required"});
				return false;
			}
		}
		else if( keyRule[0] === "minLength"){
			if( value.length < keyRule[1] ) {
				setFormErrors((formErrors) => ({...formErrors, [key]: `Value too short, ${key} should be at least ${keyRule[1]} characters long.`}));
				return false;
			}
		}
	}

	const checkValidationRules = () => {
		let validInputs = true;
		if( rules === undefined ) return;
		else{
			Object.entries(values).forEach(keyValue => {
				const key = keyValue[0];
				const value = keyValue[1];
				const keyRules = rules[key as keyof typeof rules];

				for (let keyRule of Object.entries(keyRules)) {
					if( validateRule(key, value, keyRule) === false ) {
						validInputs = false;
						break;
					}
				}
			})
		}
		return validInputs;
	}

  const onSubmit = (e:any, func?: () => void ) => {
		e.preventDefault();
		if ( !checkValidationRules() ) return;
		func?.();
	};

  const onChange = (e: any) => {
		setValues({...values, [e.target.name]: e.target.value});

		const key = e.target.name;
		delete formErrors[key as keyof typeof formErrors];

		setFormErrors({...formErrors});
	};

  return { onSubmit, onChange, values, formErrors };
};

export default useForm;
