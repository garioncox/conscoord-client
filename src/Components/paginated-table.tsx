import { Pagination } from "./Pagination";
import { PaginationControl } from "./PaginatedTableHook";

interface PaginatedProjectTableProps<T> {
  control: PaginationControl<T>;
  children: React.ReactNode;
}

export function PaginatedTable<T>({
  children,
  control,
}: PaginatedProjectTableProps<T>) {
  return (
    <div className="space-y-4 shadow-xl border p-10 rounded-xl bg-tertiary min-w-full">
      {children}
      <Pagination
        setCurrentPage={control.setCurrentPage}
        setItemsPerPage={control.setItemsPerPage}
        itemsPerPage={control.itemsPerPage}
        currentPage={control.currentPage}
        handleItemsPerPageChange={control.handleItemsPerPageChange}
        handlePageChange={control.handlePageChange}
        totalPages={control.totalPages}
      />
    </div>
  );
}
