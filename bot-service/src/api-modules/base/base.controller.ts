import BaseApiResponse from './base.api.response';

export class BaseController {
  public successResponse<T>(data: T): BaseApiResponse<T> {
    return { errorCode: 0, errorMessage: '', result: data };
  }

  public timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
