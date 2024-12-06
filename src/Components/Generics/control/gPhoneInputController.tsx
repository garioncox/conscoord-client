import { useEffect, useState } from "react";

export interface GPhoneInputController {
  value: string;
  setValue: (v: string) => void;
  hasBeenTouched: boolean;
  setHasBeenTouched: (b: boolean) => void;
  error: string;
}

export function validatePhone(s: string) {
  const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  return !phoneRegex.test(s) ? "Please enter a valid phone number" : ""
}

export const useGPhoneInput = (
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
