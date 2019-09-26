import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import BaseApiResponse from '../api-modules/base/base.api.response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let json;
    switch (exception.constructor) {
      case HttpException:
        json = this.createJsonFromHttpExceptions(exception as HttpException);
        break;
      case BadRequestException:
        json = this.createJsonFromBadRequestExceptions(
          exception as BadRequestException,
        );

      case UnauthorizedException:
        json = this.createJsonFromUnauthorizationExceptions(exception as UnauthorizedException);
    }

    if (!json) {
      json = this.createJsonFromUnknownExceptions(exception);
    }

    response.status(200).json(json);
  }

  private createJsonFromHttpExceptions(
    exception: HttpException,
  ): BaseApiResponse<string> {
    return {
      result: null,
      errorCode: exception.getStatus(),
      errorMessage: exception.toString(),
    };
  }

  private createJsonFromUnauthorizationExceptions(
    exception: UnauthorizedException,
  ): BaseApiResponse<string> {
    return {
      result: null,
      errorCode: exception.message.statusCode,
      errorMessage: exception.message.error,
    };
  }

  private createJsonFromUnknownExceptions(
    exception: Error,
  ): BaseApiResponse<string> {
    return {
      result: null,
      errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: exception.message,
    };
  }

  private createJsonFromBadRequestExceptions(
    exception: BadRequestException,
  ): BaseApiResponse<string> {
    let validation;
    if (exception.getResponse()) {
      validation = (exception.getResponse() as any).message;
    }
    return {
      result: null,
      errorCode: exception.getStatus(),
      errorMessage: 'Validation Error',
      validation,
    };
  }
}
