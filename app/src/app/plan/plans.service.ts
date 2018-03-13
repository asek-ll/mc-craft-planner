import { Injectable } from '@angular/core';
import { StoreHandler } from '../store-handler';
import { Plan } from './plan';
import { DataRequester } from '../data-requester';

@Injectable()
export class PlansService extends StoreHandler<Plan> {

  constructor(private dataRequester: DataRequester) {
    super(dataRequester, 'plans', Plan);
  }

}
