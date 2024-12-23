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
    const currentItems = data ? data.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = data ? Math.ceil(data.length / itemsPerPage) || 1 : 1;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
      };
    
      const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); 
      };
  
    return {totalPages, handlePageChange, handleItemsPerPageChange, setCurrentPage, setItemsPerPage, currentPage, itemsPerPage, currentItems};
  }