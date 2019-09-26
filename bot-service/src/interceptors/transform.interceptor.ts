import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import BaseApiResponse from '../api-modules/base/base.api.response';
import { plainToClass } from 'class-transformer';
import { ApiResponse } from '@nestjs/swagger';
import { options } from 'tsconfig-paths/lib/options';
import { type } from 'os';

type ClassType<T> = new () => T;

@Injectable()
export class TransofrmEntityToDtoInterceptor<T> implements NestInterceptor {
  constructor(private readonly classType: ClassType<T>) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map(data => {
        const test = this.classType.call(data);
        console.log(test);
        console.log(typeof(test));
        return test;
      }),
    );
  }
}
