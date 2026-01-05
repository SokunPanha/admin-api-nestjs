export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  total: number;
  items: T[];
}

export interface PaginatedResponse<T> extends ApiResponse<PaginatedData<T>> {
  data: PaginatedData<T>;
}
