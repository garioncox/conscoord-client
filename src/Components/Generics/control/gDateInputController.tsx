import { useEffect, useState } from "react";

export interface GDateInputController {
  value: string;
  setValue: (v: string) => void;
  hasBeenTouched: boolean;
  setHasBeenTouched: (b: boolean) => void;
  error: string;
}

export const useGDateInput = (
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
