import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  handleItemsPerPageChange: (value: string) => void;
  handlePageChange: (pageNumber: number) => void;
  totalPages: number;
  itemsPerPage: number;
  currentPage: number;
}

export function Pagination({
  handleItemsPerPageChange,
  handlePageChange,
  totalPages,
  itemsPerPage,
  currentPage,
}: PaginationProps) {


  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">Items per page</p>
        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
          <SelectTrigger className="w-[70px] bg-tertiary text-primary border-2 border-secondary">
            <SelectValue placeholder={itemsPerPage.toString()} />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            <SelectItem value="5" className="hover:bg-slate-200">5</SelectItem>
            <SelectItem value="10" className="hover:bg-slate-200">10</SelectItem>
            <SelectItem value="20" className="hover:bg-slate-200">20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-[40px] bg-tertiary text-primary border-2 border-slate-300 hover:bg-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-[40px] bg-tertiary text-primary border-2 border-slate-300 hover:bg-slate-300"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
