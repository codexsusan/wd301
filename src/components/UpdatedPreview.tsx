import React, { useState, MouseEvent, useEffect } from "react";
import { FormData } from "../types/formTypes";
import { navigate } from "raviger";

const getAllLocalForms: () => FormData[] = () => {
  const savedFormData: string = localStorage.getItem("savedForms") || "";
  const parsedFormData: FormData[] = JSON.parse(savedFormData);
  return parsedFormData;
};

const currentForm: (id: number) => FormData = (id: number) => {
  const allLocalForms = getAllLocalForms();
  const selectedForm: FormData | undefined = allLocalForms.find(
    (form: FormData) => form.id === id
  );
  if (selectedForm === undefined) {
    navigate("/error");
    return allLocalForms[0];
  }
  return selectedForm;
};

const savetoLocalForms = (localForms: FormData[]) => {
  const allLocalForms: FormData[] = getAllLocalForms();
  const updatedLocalForms = allLocalForms.map((form) => {
    return form.id === localForms[0].id ? localForms[0] : form;
  });
  localStorage.setItem("savedForms", JSON.stringify(updatedLocalForms));
};

function UpdatedPreview(props: { formId: number }) {
  //   currentForm(props.formId);
  const [form, setForm] = useState<FormData>(currentForm(props.formId));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentField, setCurrentField] = useState(
    form.formFields[currentIndex]
  );
  const [submitStatus, setSubmitStatus] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      savetoLocalForms([form]);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [form]);

  const handlePrevious: (e: MouseEvent) => void = (e: MouseEvent) => {
    e.preventDefault();
    setCurrentField(form.formFields?.[currentIndex - 1]);
    setCurrentIndex(currentIndex - 1);
  };

  const handleNext: (e: MouseEvent) => void = (e: MouseEvent) => {
    e.preventDefault();
    setCurrentField(form.formFields?.[currentIndex + 1]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleChanges = (id: number, value: string) => {
    setCurrentField({ ...currentField, value });
    const updatedFormFields = form.formFields.map((field) => {
      return id === field.id ? { ...field, value } : field;
    });
    setForm({ ...form, formFields: updatedFormFields });
    // savetoLocalForms([form]);
  };

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    savetoLocalForms([form]);
    // alert("Form Submitted");
    setSubmitStatus(true);
  };

  return (
    <div className="mx-2">
      {submitStatus ? (
        <p className="w-full text-center">Form Submitted</p>
      ) : (
        <>
          <p className="text-2xl text-center my-4">{form.title}</p>
          <label className="block" htmlFor={currentField.label}>
            {currentField.label}
          </label>
          <input
            onChange={(e) => {
              handleChanges(currentField.id, e.target.value);
            }}
            name={currentField.label}
            value={currentField.value}
            className="border w-full border-gray-200 rounded-lg p-2 mt-2 mb-4 flex-1"
            type={currentField.type}
          />
          <div className="flex justify-between">
            <div className="w-full">
              {currentIndex > 0 && (
                <button
                  onClick={(e) => {
                    handlePrevious(e);
                  }}
                  className="p-2 border bg-blue-500 text-white rounded-lg"
                >
                  Previous
                </button>
              )}
            </div>
            {currentIndex < form.formFields.length - 1 && (
              <button
                onClick={(e) => {
                  handleNext(e);
                }}
                className="p-2 border bg-blue-500 text-white rounded-lg"
              >
                Next
              </button>
            )}
            {currentIndex === form.formFields.length - 1 && (
              <button
                onClick={(e) => {
                  handleSubmit(e);
                }}
                className="p-2 border text-white rounded-lg bg-red-600"
              >
                Submit
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UpdatedPreview;
