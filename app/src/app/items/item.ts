import { StoredItem } from '../stored-item';

export class Item extends StoredItem {
  sid: string;
  name: string;
  displayName: string;
  id: number;
  meta: number;
  icon: string;
}
