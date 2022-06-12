import { useState } from "react";
import {  FormInterface } from "../types/formTypes/formTypes";
import {RegisterHondInterface, registerRulesInterface} from "../types/formTypes/registerTypes"
import {newHond} from "../helpers/form/registerHelpers";

type useFormProps = FormInterface;
type rulesType = registerRulesInterface;

const useForm = (initialValues: useFormProps, rules?: rulesType) => {
	const [values, setValues] = useState<useFormProps>(initialValues);
	const [formErrors, setFormErrors] = useState<FormInterface>({} as FormInterface);

  const onSubmit = (e:any, func?: () => void ) => {
		e.preventDefault();
		// if ( !validateInputs(values, rules, setFormErrors, formErrors) ) return;
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
