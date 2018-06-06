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

  protected abstract toRaw(item: T): I;

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
    // console.time('storeQuery');
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-find', {
        query,
        limit,
        skip,
      }, (rawItems: I[]) => {
        // console.timeEnd('storeQuery');
        console.log(query);
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

  insertItem(item: T, options: object = {}): Promise<T> {
    const data = this.toRaw(item);
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-insert', {
        data,
        options
      }, (resultData: I) => {
        resolve(this.convertOne(resultData));
      });
    });
  }

  updateItem(item: T, options: object = {}): Promise<T> {
    const data = this.toRaw(item);
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-update', {
        query: {
          _id: item._id,
        },
        data,
        options,
      }, (resultData: I) => {
        resolve(item);
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

export abstract class StoreHandler<T extends StoredItem> extends SimpleStoreHandler<T, object> {
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

  protected toRaw(item: T): object {
    return item;
  }

}
