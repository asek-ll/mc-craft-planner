import { Injectable } from '@angular/core';
import { StoreHandler } from '../store-handler';
import { Handler } from './handler';
import { DataRequester } from '../data-requester';

@Injectable()
export class HandlersService extends StoreHandler<Handler> {
  constructor(private dataRequester: DataRequester) {
    super(dataRequester, 'handlers', Handler);
  }
}
