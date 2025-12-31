declare type ErrorResponse = {
  message: string;
  code: number;
};

declare type SuccessResponse<T> = {
  message: string;
} & T; // extend type for any another data in response

declare type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;