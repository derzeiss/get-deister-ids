import { ResItem } from './ResItem.js';

export interface ResIdentItem extends ResItem {
  hasUser: boolean;
  userId: number;
}
