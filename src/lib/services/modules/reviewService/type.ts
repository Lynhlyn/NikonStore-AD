export interface ReviewImage {
  id: number;
  imageUrl: string;
  createdAt: string;
}

export interface Customer {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  urlImage: string | null;
}

export interface Review {
  id: number;
  productId: number;
  customer: Customer;
  rating: number;
  comment: string | null;
  status: number;
  reviewImages: ReviewImage[];
  orderDetailId?: number;
  orderId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  status: number;
  message: string;
  data: Review[];
}

