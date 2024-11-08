import React from "react";

export interface PaginatedTableControl <T>{
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
    currentPage: number;
    itemsPerPage: number;
    currentItems: T[];
    handlePageChange: (pageNumber: number) => void;
    handleItemsPerPageChange: (value: string) => void;
    totalPages: number;
  }
  
  export function usePaginatedTable <T>(data: T[]) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(5);
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
      };
    
      const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); // Reset to page 1 when items per page change
      };
  
    return {totalPages, handlePageChange, handleItemsPerPageChange, setCurrentPage, setItemsPerPage, currentPage, itemsPerPage, currentItems};
  }