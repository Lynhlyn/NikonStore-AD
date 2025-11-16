export interface Contact {
  id: number;
  name: string;
  phone: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContactResponse {
  status: number;
  message: string;
  data: Contact;
}

export interface IContactListResponse {
  status: number;
  message: string;
  data: Contact[];
  pagination?: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

export interface CreateContactRequest {
  name: string;
  phone: string;
  content: string;
  status?: string;
}

export interface UpdateContactRequest {
  name: string;
  phone: string;
  content: string;
  status: string;
}

