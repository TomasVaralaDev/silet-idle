import { planks } from './planks';
import { weapons } from './weapons';
import { jewelry } from './jewelry';
import type { Resource } from '../../../types';

export const craftingResources: Resource[] = [
  ...planks,
  ...weapons,
  ...jewelry,
];