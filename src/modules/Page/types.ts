export type PageFormData = {
  title: string;
  slug: string;
  content: string;
};

export type PageUpdateData = {
  id: number;
  title: string;
  slug: string;
  content: string;
};

export type PageResponse = {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
