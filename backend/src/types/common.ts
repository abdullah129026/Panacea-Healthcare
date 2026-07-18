/**
 * Common types shared across the API
 * Mirrors frontend src/types/common.ts
 */

export interface Pagination {
  page: number;
  size: number;
  total: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export type ISODateString = string & { readonly __brand: 'ISODateString' };

export function toISODateString(date: Date | string): ISODateString {
  const isoString = typeof date === 'string' ? date : date.toISOString();
  return isoString as ISODateString;
}
