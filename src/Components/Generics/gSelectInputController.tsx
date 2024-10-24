import { useEffect, useState } from "react";

export interface GSelectInputController {
  value: string;
  setValue: (v: string) => void;
  possibleValues: string[];
  defaultValue?: string;
  hasBeenTouched: boolean;
  setHasBeenTouched: (b: boolean) => void;
  error: string;
}

export const useGSelectInput = (
  possibleValues: string[] = [],
  getErrorMessage: (value: string) => string,
  defaultValue?: string
) => {
  const [value, setValue] = useState(defaultValue ?? "");
  const [error, setError] = useState("");
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  useEffect(() => {
    setError(getErrorMessage(value));
  }, [getErrorMessage, value]);

  return {
    value,
    setValue,
    possibleValues,
    hasBeenTouched,
    setHasBeenTouched,
    error,
  };
};
