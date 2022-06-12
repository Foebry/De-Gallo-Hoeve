import { useState } from "react";
import { FormInterface } from "../types/formTypes";
import {RegisterHondInterface, RegisterInterface, registerRulesInterface} from "../types/formTypes/registerTypes"
import {newHond} from "../helpers/form/registerHelpers";

type useFormProps = FormInterface;
type rulesType = registerRulesInterface;

const useForm = (initialValues: useFormProps, rules?: rulesType) => {
	const [values, setValues] = useState(initialValues);
	const [formErrors, setFormErrors] = useState<FormInterface>({});

	const validateRule = (key: string, value: string, keyRule: Array<any>) => {
		if( keyRule[0] === "required"){
			if( value === "") {
				setFormErrors({...formErrors, [key]: "This field is required"});
				return false;
			}
		}
		else if( keyRule[0] === "minLength"){
			if( value.length < keyRule[1] ) {
				setFormErrors({...formErrors, [key]: `Value too short, ${key} should be at least ${keyRule[1]} characters long.`});
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
		const name = e.target.name;
		const value = e.target.value;
		setValues({...values, [name]: value});

		const key = e.target.name;
		delete formErrors[key as keyof typeof formErrors];

		setFormErrors({...formErrors});
	};
	
	const handleHondInput = (e: any) => {
		const dataid = e.target.dataset.id;
		const name = e.target.name;
		const value = e.target.value;
		const hond = values.honden?.filter(({ id }) => id === dataid)[0];
		let dogs = [] as RegisterHondInterface[];

		if (!hond) {
			dogs = [{ ...newHond(dataid), [name]: value }];
		} else {
			const dog = { ...hond, [name]: value };
			if (values.honden){
				dogs = [...values.honden.filter(({ id }) => id !== dataid), dog] || [];
			}
		}
		setValues({ ...values, honden: [...dogs] });
	};

  return { onSubmit, onChange, values, formErrors, handleHondInput };
};

export default useForm;
