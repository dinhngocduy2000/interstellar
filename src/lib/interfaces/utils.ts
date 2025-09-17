import { ReactNode } from "react";
export type ReactQueryHookParams<T> = {
  queryKey: unknown[];
  params: T;
};
export type IResponseDataWithPagination<T> = {
  total: number;
  data: T[];
};

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
  title?: string;
}

export type IDropdownMenuProps = {
  trigger?: string | ReactNode;
  items: IDropdownMenuItem[];
  onSearch?: (_value: string) => void;
  dropdownContentClassName?: string;
  contentAlign?: "start" | "end";
  dropdownTriggerClassName?: string;
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
  onError?: (_error: unknown) => void;
  onMutate?: VoidFunction;
  signal?: AbortSignal;
}

export interface AxiosErrorPayload {
  message: string;
  error: string;
  statusCode: number;
}
