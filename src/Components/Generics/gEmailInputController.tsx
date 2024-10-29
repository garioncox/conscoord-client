import { useEffect, useState } from "react";

export interface GEmailInputController {
  value: string;
  setValue: (v: string) => void;
  hasBeenTouched: boolean;
  setHasBeenTouched: (b: boolean) => void;
  error: string;
}

export function validateEmail(s: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return !emailRegex.test(s) ? "Please enter a valid email" : ""
}


export const useGEmailInput = (
  startValue: string = "",
  getErrorMessage: (value: string) => string
) => {
  const [value, setValue] = useState(startValue);
  const [error, setError] = useState("");
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  useEffect(() => {
    setError(getErrorMessage(value));
  }, [getErrorMessage, value]);

  return {
    value,
    setValue,
    hasBeenTouched,
    setHasBeenTouched,
    error,
  };
};
