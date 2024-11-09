import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
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
        <select onChange={(e) => handleItemsPerPageChange(e.target.value)} className="w-[70px]">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>

          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder={itemsPerPage.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
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
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
