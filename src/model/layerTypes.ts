export interface ILayerInfo {
  name: string;
  magicName: string;
  color: string;
  hatched?: boolean;
  crossY: number;
  crossHeight: number;
  description?: string;

  /* List of layers that always intersect with this layer */
  intersectLayers?: string[];
}

export const layerTypes: ILayerInfo[] = [
  {
    name: 'P SUB',
    magicName: 'pmos',
    color: '#cccc00',
    hatched: true,
    crossY: 100,
    crossHeight: 200,
  },
  // { name: 'N DIFF', magicName: 'ndiff', color: '#8080ff', crossY: 80, crossHeight: 20 },
  // { name: 'POLY', magicName: 'poly', color: '#ff8080', crossY: 70, crossHeight: 10 },
  // { name: 'CONTACT', magicName: 'polycont', color: '#80ff80', crossY: 70, crossHeight: 10 },

  {
    name: 'nwell',
    magicName: 'nwell',
    color: 'gray',
    crossY: 100,
    crossHeight: 30,
    hatched: true,
    description: 'used to isolate p-diffusion from the p-substrate'
  },
  { name: 'ndiffusion', magicName: 'ndiffusion', color: '#8080ff', crossY: 100, crossHeight: 15, description: 'n-diffusion layer used to make n mosfets' },
  { name: 'pdiffusion', magicName: 'pdiffusion', color: '#4040ff', crossY: 100, crossHeight: 15, description: 'p-diffusion layer used to make p mosfets' },
  {
    name: 'pdcontact',
    magicName: 'pdcontact',
    color: '#ffff80',
    crossY: 70,
    crossHeight: 30,
    description: 'connects between p-diffusion and metal',
    intersectLayers: ['metal1', 'pdiffusion'],
  },
  {
    name: 'ndcontact',
    magicName: 'ndcontact',
    color: '#ff80ff',
    crossY: 70,
    crossHeight: 30,
    description: 'connects between n-diffusion and metal',
    intersectLayers: ['metal1', 'ndiffusion'],
  },
  {
    name: 'nsubstratencontact',
    magicName: 'nsubstratencontact',
    color: 'purple',
    crossY: 70,
    crossHeight: 30,
    description: 'connects between n-well and metal',
    intersectLayers: ['metal1', 'nwell'],
  },
  {
    name: 'psubstratepcontact',
    magicName: 'psubstratepcontact',
    color: 'orange',
    crossY: 70,
    crossHeight: 30,
    description: 'connects between p-substrate and metal',
    intersectLayers: ['metal1', 'P SUB'],
  },
  {
    name: 'polysilicon',
    magicName: 'polysilicon',
    color: 'rgb(220, 95, 95)',
    crossY: 85,
    description: 'polycrystalline silicon, used as the gate for mosfets',
    crossHeight: 10,
  },
  {
    name: 'polycontact',
    magicName: 'polycontact',
    color: '#80ff80',
    crossY: 70,
    crossHeight: 15,
    description: 'connects between polysilicon and metal',
    intersectLayers: ['metal1', 'polysilicon'],
  },
  { name: 'metal1',
    magicName: 'metal1',
    color: 'rgb(125, 166, 250)',
    crossY: 55, 
    crossHeight: 15,
    description: 'metal layer used for wiring up the circuit'
  },
];
