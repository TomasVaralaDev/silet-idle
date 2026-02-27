import { ingots } from './ingots';
import { armor } from './armor';
import { tools } from './tools';
import type { Resource } from '../../../types';

export const smithingResources: Resource[] = [
  ...ingots,
  ...armor,
  ...tools
];