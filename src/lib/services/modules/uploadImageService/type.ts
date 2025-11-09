export interface IUploadImageResponse {
  status: number;
  message: string;
  data: string[];
}

export interface IDeleteImageResponse {
  status: number;
  message: string;
  data: boolean[];
}

export interface IDeleteSingleImageResponse {
  status: number;
  message: string;
  data: boolean;
}

export interface IUploadImageRequest {
  files: File[];
  folder: string;
}

export interface IDeleteImagesRequest {
  imageUrls: string[];
}

