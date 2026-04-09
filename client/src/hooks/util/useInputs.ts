import { useState, useCallback, ChangeEvent } from "react";

type InputChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | ChangeEvent<HTMLTextAreaElement>
  | ChangeEvent<HTMLSelectElement>;

function useInputs<T>(initialForm: T) {
  const [form, setForm] = useState(initialForm);
  // change
  const onChange = useCallback((e: InputChangeEvent) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
  }, []);
  const reset = useCallback(() => setForm(initialForm), [initialForm]);
  return { form, onChange, reset };
}

export default useInputs;
