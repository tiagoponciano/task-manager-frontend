export type Task = {
  id: number;
  title: string;
  description?: string;
  dueTo: string;
  relevance: string;
  priority?: number;
  userId: number;
  concluded?: boolean;
  createdOn: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  dueTo: string;
  relevance: string;
  priority?: number;
  userId: number;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  concluded?: boolean;
};
