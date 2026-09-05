/**
 * Standardized API response contract.
 * Both apps/api and apps/web use this shape.
 */

export interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: ApiFieldError[];
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiFieldError {
  field: string;
  message: string;
}
