// SPDX-License-Identifier: Apache-2.0

export interface ILayerInfo {
  name: string;
  magicName: string;
  color: string;
  hatched?: boolean;
  crossY: number;
  crossHeight: number;
  description?: string;

  /** Whether this layer is masked by polysilicon */
  masked?: boolean;

  /** For contact layers, set this to the merged contact layer name that will be displayed in the UI */
  contactName?: string;

  /** Whether this is the default layer for the given merged contact layer */
  contactDefault?: boolean;

  /** Whether this layer supports labels (e.g. a metal layer) */
  hasLabels?: boolean;

  /** List of layers that always intersect with this layer */
  intersectLayers?: string[];
}

export const layerTypes: ILayerInfo[] = [
  {
    name: 'P SUB',
    magicName: 'pmos',
    color: '#cccc00',
    hatched: true,
    crossY: 100,
    crossHeight: 30,
    description: 'p-doped silicon that is the base layer everything else is built on',
  },
  {
    name: 'nwell',
    magicName: 'nwell',
    color: 'gray',
    crossY: 100,
    crossHeight: 25,
    hatched: true,
    description: 'used to isolate p-diffusion from the p-substrate',
  },
  {
    name: 'ndiffusion',
    magicName: 'ndiffusion',
    color: '#8080ff',
    crossY: 100,
    crossHeight: 15,
    masked: true,
    description: 'n-diffusion layer used to make n mosfets',
  },
  {
    name: 'pdiffusion',
    magicName: 'pdiffusion',
    color: '#4040ff',
    crossY: 100,
    crossHeight: 15,
    masked: true,
    description: 'p-diffusion layer used to make p mosfets',
  },
  {
    name: 'p tap',
    magicName: 'psubstratepdfiff',
    color: '#4040ff',
    crossY: 100,
    crossHeight: 15,
    hatched: true,
    description: 'used to connect p diffusion to power supply',
  },
  {
    name: 'n tap',
    magicName: 'nsubstratendiff',
    color: '#8080ff',
    crossY: 100,
    crossHeight: 15,
    hatched: true,
    description: 'used to connect n diffusion to power supply',
  },
  {
    name: 'pdcontact',
    magicName: 'pdcontact',
    color: '#ffff80',
    crossY: 70,
    crossHeight: 30,
    description: 'connects between p-diffusion and metal',
    contactName: 'met1 contact',
    intersectLayers: ['metal1', 'pdiffusion'],
  },
  {
    name: 'ndcontact',
    magicName: 'ndcontact',
    color: '#ff80ff',
    crossY: 70,
    crossHeight: 30,
    description: 'connects between n-diffusion and metal',
    contactName: 'met1 contact',
    intersectLayers: ['metal1', 'ndiffusion'],
  },
  {
    name: 'nsubstratencontact',
    magicName: 'nsubstratencontact',
    color: 'purple',
    crossY: 70,
    crossHeight: 30,
    description: 'connects between n-well and metal',
    contactName: 'met1 contact',
    intersectLayers: ['metal1', 'nwell'],
  },
  {
    name: 'psubstratepcontact',
    magicName: 'psubstratepcontact',
    color: 'orange',
    crossY: 70,
    crossHeight: 30,
    description: 'connects between p-substrate and metal',
    contactName: 'met1 contact',
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
    name: 'polyres',
    magicName: 'polyres',
    color: 'gold',
    crossY: 85,
    crossHeight: 10,
    description: 'polycrystalline silicon virtual layer, used to draw resistors',
  },
  {
    name: 'met1 contact',
    magicName: 'polycontact',
    color: '#80ff80',
    crossY: 70,
    crossHeight: 15,
    description: 'connects between polysilicon and metal',
    contactName: 'met1 contact',
    contactDefault: true,
    intersectLayers: ['metal1', 'polysilicon'],
  },
  {
    name: 'metal1',
    magicName: 'metal1',
    color: 'rgb(125, 166, 250)',
    crossY: 55,
    crossHeight: 15,
    description: 'metal layer used for wiring up the circuit',
    hasLabels: true,
  },
  {
    name: 'mimcap',
    magicName: 'mimcap',
    color: 'rgb(100, 100, 100)',
    crossY: 45, // should be just above met1
    crossHeight: 5,
    description: 'thin layer of metal used to form metal-insulator-metal capacitors',
  },
  {
    name: 'mimcap contact',
    magicName: 'mimcapcontact',
    color: '#80ff80',
    crossY: 30,
    crossHeight: 15,
    description: 'connects between mimcap and metal2',
    contactName: 'met2 contact',
    intersectLayers: ['metal2', 'mimcap'],
  },
  {
    name: 'met2 contact',
    magicName: 'm2contact',
    color: '#80ff80',
    crossY: 30,
    crossHeight: 25,
    description: 'connects between metal1 and metal2',
    contactName: 'met2 contact',
    contactDefault: true,
    intersectLayers: ['metal2', 'metal1'],
  },
  {
    name: 'metal2',
    magicName: 'metal2',
    color: 'rgb(125, 200, 250)',
    crossY: 10,
    crossHeight: 20, // bit thicker than met1
    description: 'metal layer 2, used to connect to the mimcap layer',
    hasLabels: true,
  },
];
