import { DataRequester } from './data-requester';
import { StoredItem } from './stored-item';

export abstract class StoreHandler<T extends StoredItem> {

  constructor(
    private requester: DataRequester,
    public collectionName: string,
    private itemClass: new() => T
  ) { }

  protected createItem(json: object): T {

    var item = new this.itemClass();

    for (var propName in json) {
      item[propName] = json[propName];
    }

    return item;
  }

  private createItems(jsons: object[]): T[] {
    return jsons.map(json => this.createItem(json));
  }

  findOne(query: object): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requester.requestData(this.collectionName + '-find-one', {
        query
      }, (item: T) => {
        if (item) {
          resolve(item)
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
      }, (rawItems: object[]) => {
        resolve(this.createItems(rawItems));
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
      }, (data: object) => {
        resolve(this.createItem(data));
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
      }, (data: object) => {
        resolve(this.createItem(data));
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
