interface Response {
  code: number;
  status: "success" | "failed";
  message?: string;
}

interface SuccessResponse<T> extends Response {
  data: T;
}

interface ErrorResponse extends Response {
  error: string;
  message: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
