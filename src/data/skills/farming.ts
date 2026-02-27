import type { Resource } from '../../types';

export const farmingResources: Resource[] = [
  {
    id: 'crop_potato',
    name: 'Raw Potato',
    rarity: 'common',
    level: 1,
    xpReward: 10,
    interval: 10000,
    value: 3,
    icon: '/assets/resources/crop_potato.png',
    color: 'text-yellow-600',
    description: 'Basic raw food.',
    area: undefined,
  },
];