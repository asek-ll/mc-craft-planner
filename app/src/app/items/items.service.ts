import { Injectable } from '@angular/core';
import { Item } from './item';
import { DataRequester } from '../data-requester';
import { StoreHandler } from '../store-handler';

type ResolveCallback = (Item) => void;

export class BatchItemLoader {

  private sids: { [sid: string]: ResolveCallback[] } = {};

  constructor(private itemsService: ItemsService) { }

  private storeCallback(sid: string, resolve: ResolveCallback) {
    if (!this.sids[sid]) {
      this.sids[sid] = [];
    }
    this.sids[sid].push(resolve);
  }

  load(sid: string): Promise<Item> {
    return new Promise((resolve) => {
      this.storeCallback(sid, resolve);
    });
  }

  process() {
    const keys = Object.keys(this.sids);
    return this.itemsService.find({
      sid: {
        $in: keys
      }
    }).then(values => {

      values.forEach(value => {
        const callbacks = this.sids[value.sid];
        if (callbacks) {
          callbacks.forEach(callback => callback(value));
        }
      });
    });
  }

}

@Injectable()
export class ItemsService extends StoreHandler<Item> {
  constructor(private dataRequester: DataRequester) {
    super(dataRequester, 'items', Item);
  }

  getBatchLoader() {
    return new BatchItemLoader(this);
  }
}
