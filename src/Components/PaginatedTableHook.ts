import { Dispatch, SetStateAction, useEffect, useState } from "react";

export interface PaginationControl<T> {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  itemsPerPage: number;
  currentItems: T[];
  handlePageChange: (pageNumber: number) => void;
  handleItemsPerPageChange: (value: string) => void;
  totalPages: number;
}

export function usePagination<T>(data: T[]) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data
    ? data.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const totalPages = data ? Math.ceil(data.length / itemsPerPage) || 1 : 1;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 0) {
      setCurrentPage(1);
      return;
    }

    if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
      return;
    }

    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentPage < 0) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      return;
    }
  }, [data, totalPages, currentPage]);

  return {
    totalPages,
    handlePageChange,
    handleItemsPerPageChange,
    setCurrentPage,
    setItemsPerPage,
    currentPage,
    itemsPerPage,
    currentItems,
  };
}
