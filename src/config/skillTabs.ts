import type { Resource, SkillType } from '../types';

export interface TabConfig {
  id: string;
  label: string;
  // Filter-funktio saa resurssin ja palauttaa true, jos se kuuluu tähän tabiin
  filter: (item: Resource) => boolean;
}

export const SKILL_TABS: Partial<Record<SkillType, TabConfig[]>> = {
  
  // FOUNDRY (Smithing)
  smithing: [
    { 
      id: 'all', 
      label: 'All', 
      filter: () => true 
    },
    { 
      id: 'smelting', 
      label: 'Smelting', 
      // KORJAUS: Nyt hyväksyy sekä 'ingot' että 'bar' nimen perusteella
      filter: (r) => r.id.includes('smelted')
    },
    { 
      id: 'armors', 
      label: 'Armors', 
      filter: (r) => ['head', 'body', 'legs'].includes(r.slot || '') 
    },
    { 
      id: 'shields', 
      label: 'Shields', 
      filter: (r) => r.slot === 'shield' 
    },
    { 
      id: 'rings', 
      label: 'Rings', 
      filter: (r) => r.slot === 'ring' 
    }
  ],

  // ASSEMBLY (Crafting)
  crafting: [
    { 
      id: 'all', 
      label: 'All', 
      filter: () => true 
    },
    { 
      id: 'refining', 
      label: 'Wood Refining', 
      // Oletus: lankut sisältävät id:ssä 'plank'
      filter: (r) => r.id.includes('plank') 
    },
    { 
      id: 'swords', 
      label: 'Swords', 
      // Oletus: miekat sisältävät id:ssä 'sword'
      filter: (r) => r.id.includes('sword') 
    },
    { 
      id: 'bows', 
      label: 'Bows', 
      // Oletus: jouset sisältävät id:ssä 'bow' (shortbow, longbow jne.)
      filter: (r) => r.id.includes('bow') 
    },
    { 
      id: 'staffs', 
      label: 'Staffs', 
      // Oletus: sauvat sisältävät id:ssä 'staff'
      filter: (r) => r.id.includes('staff') 
    },
    { 
      id: 'necklaces', 
      label: 'Necklaces', 
      // Tässä voidaan käyttää slottia, koska se on luotettava
      filter: (r) => r.slot === 'necklace' 
    }
  ]
};