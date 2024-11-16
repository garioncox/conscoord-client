import { Pagination } from "./Pagination";
import { PaginatedTableControl } from "./PaginatedTableHook";

interface PaginatedProjectTableProps<T> {
  paginatedTableControl: PaginatedTableControl<T>;
  children: React.ReactNode;
}

export function PaginatedTable<T>({
  children,
  paginatedTableControl,
}: PaginatedProjectTableProps<T>) {
  return (
    <div className="space-y-4 shadow-xl border p-10 rounded-xl bg-tertiary min-w-full">
      {children}
      <Pagination
        setCurrentPage={paginatedTableControl.setCurrentPage}
        setItemsPerPage={paginatedTableControl.setItemsPerPage}
        itemsPerPage={paginatedTableControl.itemsPerPage}
        currentPage={paginatedTableControl.currentPage}
        handleItemsPerPageChange={
          paginatedTableControl.handleItemsPerPageChange
        }
        handlePageChange={paginatedTableControl.handlePageChange}
        totalPages={paginatedTableControl.totalPages}
      />
    </div>
  );
}
