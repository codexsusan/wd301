import React, { useEffect, useState } from "react";
import FormCard from "./FormCard";
import { Form } from "../types/formTypes";
import {  useQueryParams } from "raviger";
import Modal from "../common/Modal";
import CreateForm from "../CreateForm";
import { deleteForm, listForms } from "../utils/apiUtils";
import { Pagination } from "../types/common";

const fetchForms = async (setFormDataCB: (value: Form[]) => void) => {
  try {
    const data: Pagination<Form> = await listForms({ offset: 0, limit: 3 });
    setFormDataCB(data.results);
  } catch (error) {
    console.log(error);
  }
};

function Home() {
  const [formData, setFormData] = useState<Form[]>([]);
  const [{ search }, setQuery] = useQueryParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [newForm, setNewForm] = useState<boolean>(false);

  useEffect(() => {
    fetchForms(setFormData);
  }, []);

  const deleteFormCB = async (id: string) => {
    // Delete form from the state
    const updatedLocalForms = formData.filter(
      (form: Form) => form.id! !== Number(id)
    );
    setFormData(updatedLocalForms);
    // Backend call to delete form
    deleteForm(Number(id))
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="flex-col my-3 gap-4">
        <div className="my-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({ search: searchTerm });
            }}
            method="GET"
          >
            <label className="text-xl" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              autoComplete="off"
              name="search"
              value={searchTerm}
              className="border p-2 block w-full rounded-lg"
              type="text"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </form>
        </div>
        {formData &&
          formData
            .filter((form) => {
              return form.title
                .toLowerCase()
                .includes(search?.toLowerCase() || "");
            })
            .map((form: Form) => {
              return form.id !== undefined ? (
                <FormCard
                  deleteFormCB={deleteFormCB}
                  key={form.id}
                  id={form.id}
                  title={form.title}
                />
              ) : null;
            })}
      </div>
      <div className="mt-4">
        <button
          onClick={() => {
            setNewForm(true);
          }}
          className="w-full p-3 text-center border border-slate-200 rounded-md shadow-xl"
        >
          Create New Form
        </button>
      </div>
      <Modal open={newForm} closeCB={() => setNewForm(false)}>
        <CreateForm />
      </Modal>
    </div>
  );
}

export default Home;
