import { useEffect, useState } from "react";

export interface GNumberInputController {
  value: number;
  setValue: (v: number) => void;
  hasBeenTouched: boolean;
  setHasBeenTouched: (b: boolean) => void;
  error: string;
}

export const useGNumberInput = (
  startValue: number = 0,
  getErrorMessage: (value: number) => string
) => {
  const [value, setValue] = useState<number>(startValue);
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
