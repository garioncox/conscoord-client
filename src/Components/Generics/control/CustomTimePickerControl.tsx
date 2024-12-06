import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

export interface CustomTimePickerControl {
  value: Dayjs | null;
  setValue: (v: Dayjs) => void;
  hasBeenTouched: boolean;
  setHasBeenTouched: (b: boolean) => void;
  error: string;
}

export const useCustomTimePickerControl = (
  startValue: Dayjs | null,
  getErrorMessage: (value: Dayjs | null) => string
) => {
  const [value, setValue] = useState<Dayjs | null>(startValue);
  const [error, setError] = useState<string>("");
  const [hasBeenTouched, setHasBeenTouched] = useState<boolean>(false);

  useEffect(() => {
    if (hasBeenTouched) {
      setError(getErrorMessage(value));
    }
  }, [getErrorMessage, hasBeenTouched, value]);

  return {
    value,
    setValue,
    hasBeenTouched,
    setHasBeenTouched,
    error,
  };
};
