export interface PageResponse {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageCreateRequest {
  title: string;
  slug: string;
  content: string;
}

export interface PageUpdateRequest {
  id: number;
  title: string;
  slug: string;
  content: string;
}

export interface IPageResponse {
  status: number;
  message: string;
  data: PageResponse;
}
