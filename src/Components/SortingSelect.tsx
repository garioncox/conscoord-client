import { useState } from "react";

function useSortableData<T>(
  data: T[],
  sortMethods: { [key: string]: (a: T, b: T) => number }
) {
  const [sortValue, setSortValue] = useState<string>("");

  const sortData = () => {
    const sorted = [...data];
    const sortFunction = sortMethods[sortValue];
    if (sortFunction) {
      sorted.sort(sortFunction);
    }
    return sorted;
  };

  return { sortedData: sortData(), sortValue, setSortValue };
}

export default useSortableData;
