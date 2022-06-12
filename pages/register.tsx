import React, { useState } from "react";
import Form from "../components/form/Form";
import useForm from "../hooks/useForm";
import FormTabs, { FormTabType } from "../components/form/FormTabs";
import {
  registerValues,
  registerRules,
} from "../types/formTypes/registerTypes";
import Step1 from "./register/step1";
import Step2 from "./register/step2";
import Step3 from "./register/step3";
import Step4 from "./register/step4";

const Register = () => {
  const { onChange, onSubmit, formErrors, values } = useForm(
    registerValues,
    registerRules
  );
  const [activeTab, setActiveTab] = useState<FormTabType>(1);

  return (
    <Form
      onSubmit={onSubmit}
      title={
        activeTab === 1
          ? "Persoonlijke gegevens"
          : activeTab === 2
          ? "Gegevens viervoeters"
          : activeTab === 3
          ? "Gegevens dierenarts"
          : "Verifieer uw gegevens aub"
      }
      formTabs={true}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 1 ? (
        <Step1
          values={values}
          onChange={onChange}
          formErrors={formErrors}
          setActiveTab={setActiveTab}
        />
      ) : activeTab === 2 ? (
        <Step2
          values={values}
          onChange={onChange}
          formErrors={formErrors}
          setActiveTab={setActiveTab}
        />
      ) : activeTab === 3 ? (
        <Step3
          values={values}
          onChange={onChange}
          formErrors={formErrors}
          setActiveTab={setActiveTab}
        />
      ) : (
        <Step4
          values={values}
          onChange={onChange}
          formErrors={formErrors}
          setActiveTab={setActiveTab}
        />
      )}
    </Form>
  );
};

export default Register;
