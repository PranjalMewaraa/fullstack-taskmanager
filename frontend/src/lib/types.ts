export type TaskStatus = 'PENDING' | 'COMPLETED';

export type User = {
  id: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
  createdAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TasksListResponse = {
  items: Task[];
  pagination: PaginationMeta;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};
