import { ReactNode } from "react";

export type ReduxStatePayload<T> = {
  type: string;
  payload: T;
};
export type IOption = {
  label: string;
  value: string;
  additonalValue?: string | ReactNode;
};

export interface IPagination {
  page: number;
  limit: number;
  type?: "page" | "infinite";
  name?: string;
}

export type IDropdownMenuProps = {
  trigger?: string | ReactNode;
  items: IDropdownMenuItem[];
  onSearch?: (value: string) => void;
  dropdownContentClassName?: string;
};

export type IDropdownMenuItem = {
  label: string | ReactNode;
  onClick: VoidFunction;
  disabled?: boolean;
};

export interface BreadcrumbHandle {
  crumb: string; // Function that takes the match and returns a string
}

export interface IMutation {
  onSuccess?: VoidFunction;
  onError?: (error: unknown) => void;
  onMutate?: VoidFunction;
  signal?: AbortSignal;
}

export interface WorkflowResponse {
  workflow_id: string;
}

export interface CheckWorkflowResult {
  status: string;
  failed_message: string;
  failed_activity_type: string;
}
