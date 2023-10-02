import { ResItem } from './ResItem.js';

export interface ResEntity<T extends object = ResItem> {
  count: number;
  Items: T[];
}
