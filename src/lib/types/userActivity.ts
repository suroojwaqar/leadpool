export interface Activity {
  category: string;
  type: string;
  source: string;
  client: string;
  createDate: string;
  otherInformation: Record<string, string>;
  _id?: string;
}

export interface UserActivityResponse {
  _id: string;
  phoneNumber: string;
  activities: Activity[];
  createDate: string;
  __v: number;
}

export interface UserActivity {
  phoneNumber: string;
  activityCount: number;
}

export interface ExcelUploadData {
  [key: string]: string;
}

// Constants for dropdown options
export const CATEGORY_OPTIONS = ["Internet", "Phone", "Email", "Other"];
export const TYPE_OPTIONS = ["Lead", "Meeting", "Call", "Other"];
export const SOURCE_OPTIONS = ["Facebook", "Instagram", "LinkedIn", "Other"];
export const CLIENT_OPTIONS = ["Emaar", "Dubai Properties", "Meraas", "Other"];
