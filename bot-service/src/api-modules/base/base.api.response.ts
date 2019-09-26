export default class BaseApiResponse<T> {
  errorCode: number;
  errorMessage: string;
  validation?: any;
  result: T;
}
