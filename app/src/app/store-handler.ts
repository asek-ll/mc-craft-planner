import { DataRequester } from './data-requester';
import { StoredItem } from './stored-item';
import { request } from 'https';

export abstract class SimpleStoreHandler<T extends StoredItem, I> {
  constructor(
    private requester: DataRequester,
    public collectionName: string,
  ) { }

  protected abstract convertOne(json: I): Promise<T>;
  protected abstract convertMultiple(jsons: I[]): Promise<T[]>;

  findOne(query: object): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-find-one', {
        query
      }, (item: I) => {
        if (item) {
          resolve(this.convertOne(item));
        } else {
          reject();
        }
      });
    });
  }

  find(query: object, limit?: number, skip?: number): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-find', {
        query,
        limit,
        skip,
      }, (rawItems: I[]) => {
        resolve(this.convertMultiple(rawItems));
      });
    });
  }

  count(query: object): Promise<number> {
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-count', {
        query,
      }, (count: number) => {
        resolve(count);
      });
    });
  }

  insertItem(data: T, options: object = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-insert', {
        data,
        options
      }, (resultData: I) => {
        resolve(this.convertOne(resultData));
      });
    });
  }

  updateItem(data: T, options: object = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-update', {
        query: {
          _id: data._id,
        },
        data,
        options,
      }, (resultData: I) => {
        resolve(this.convertOne(resultData));
      });
    });
  }

  deleteItem(data: T) {
    return this.delete({
      _id: data._id,
    });
  }

  delete(query: object): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-remove', { query }, (result) => {
        resolve(result);
      });
    });
  }
}

export abstract class StoreHandler<T extends StoredItem> extends SimpleStoreHandler<T, JSON> {
  constructor(
    requester: DataRequester,
    collectionName: string,
    private itemClass: new () => T,
  ) {
    super(requester, collectionName);
  }

  protected simpleConvertOne(json: object): T {
    const item = new this.itemClass();

    for (const propName of Object.keys(json)) {
      item[propName] = json[propName];
    }

    return item;
  }

  protected convertOne(json: object): Promise<T> {
    return Promise.resolve(this.simpleConvertOne(json));
  }

  protected convertMultiple(jsons: object[]): Promise<T[]> {
    return Promise.resolve(jsons.map(json => this.simpleConvertOne(json)));
  }

}
