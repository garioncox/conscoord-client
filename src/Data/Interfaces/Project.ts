export interface Project {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  contactinfo: number;
  description: string;
}

export const STATUS_ACTIVE = "ACTIVE";
export const STATUS_ARCHIVED = "ARCHIVED";
