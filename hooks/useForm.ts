import React, { ChangeEvent, useState } from "react";
import {  FormInterface } from "../types/formTypes/formTypes";
import {RegisterHondInterface, registerRulesInterface} from "../types/formTypes/registerTypes"
import {newHond} from "../helpers/form/registerHelpers";

type useFormProps = FormInterface;
type rulesType = registerRulesInterface;

const useForm = (initialValues: useFormProps, rules?: rulesType) => {
	const [values, setValues] = useState<useFormProps>(initialValues);
	const [formErrors, setFormErrors] = useState<FormInterface>({} as FormInterface);

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
		const name = e.currentTarget.name;
		const value = e.currentTarget.value;
		
		setValues({...values, [name]: value});
		
		delete formErrors[name as keyof typeof formErrors];

		setFormErrors({...formErrors});
	};
	
	const handleHondInput = (e: React.FormEvent<HTMLInputElement>) => {
		const dataid = e.currentTarget.dataset.id;
		const name = e.currentTarget.name;
		const value = e.currentTarget.value;
		const hond = values.honden?.filter(({ id }) => id === dataid)[0];
		let dogs = [] as RegisterHondInterface[];

		if (!hond) {
			dogs = [{ ...newHond(dataid ?? ""), [name]: value }];
		} else {
			const dog = { ...hond, [name]: value };
			if (values.honden){
				dogs = [...values.honden.filter(({ id }) => id !== dataid), dog] || [];
			}
		}
		setValues({ ...values, honden: [...dogs] });
	};

	const handleChangeSelect = (e: React.FormEvent<HTMLSelectElement>) => {

	}

  return { onChange, values, formErrors, handleHondInput, handleChangeSelect };
};

export default useForm;
