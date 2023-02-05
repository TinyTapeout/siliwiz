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

  /** What other layer this contact layer depends on (for multiple layers, we'll look for a single match) */
  contactDepends?: string[];

  /** Whether this layer supports labels (e.g. a metal layer) */
  hasLabels?: boolean;

  /** List of layers that always intersect with this layer */
  intersectLayers?: string[];
}

export const layerTypes: ILayerInfo[] = [
  {
    name: 'p substrate',
    magicName: 'pmos',
    color: '#cccc00',
    hatched: true,
    crossY: 100,
    crossHeight: 30,
    description: 'p doped silicon used to make base layer',
  },
  {
    name: 'n well',
    magicName: 'nwell',
    color: 'gray',
    crossY: 100,
    crossHeight: 25,
    hatched: true,
    description: 'n doped used to isolate p diffusion from the p substrate',
  },
  {
    name: 'n diffusion',
    magicName: 'ndiffusion',
    color: '#8080ff',
    crossY: 100,
    crossHeight: 15,
    masked: true,
    description: 'n diffusion layer used to make n mosfets',
  },
  {
    name: 'p diffusion',
    magicName: 'pdiffusion',
    color: '#4040ff',
    crossY: 100,
    crossHeight: 15,
    masked: true,
    description: 'p diffusion layer used to make p mosfets',
  },
  {
    name: 'p tap',
    magicName: 'psubstratepdfiff',
    color: '#4040ff',
    crossY: 100,
    crossHeight: 15,
    hatched: true,
    description: 'lightly doped p diffusion used to connect the p substrate to vss',
  },
  {
    name: 'n tap',
    magicName: 'nsubstratendiff',
    color: '#8080ff',
    crossY: 100,
    crossHeight: 15,
    hatched: true,
    description: 'lightly doped n diffusion used to connect n well to vdd',
  },
  {
    name: 'n substrate n via',
    magicName: 'nsubstratencontact',
    color: 'purple',
    crossY: 70,
    crossHeight: 30,
    description: 'used to connect between n well and metal1',
    contactName: 'met1 contact',
    contactDepends: ['nwell'],
    intersectLayers: ['metal1', 'nwell'],
  },
  {
    name: 'p substrate p via',
    magicName: 'psubstratepcontact',
    color: 'orange',
    crossY: 70,
    crossHeight: 30,
    description: 'used to connect between p substrate and metal1',
    contactName: 'met1 contact',
    contactDepends: ['P SUB'],
    intersectLayers: ['metal1', 'P SUB'],
  },
  {
    name: 'p diffusion contact',
    magicName: 'pdcontact',
    color: '#ffff80',
    crossY: 70,
    crossHeight: 30,
    description: 'used to connect between p diffusion and metal1',
    contactName: 'met1 contact',
    contactDepends: ['pdiffusion'],
    intersectLayers: ['metal1', 'pdiffusion'],
  },
  {
    name: 'n diffusion contact',
    magicName: 'ndcontact',
    color: '#ff80ff',
    crossY: 70,
    crossHeight: 30,
    description: 'used to connect between n diffusion and metal1',
    contactName: 'met1 contact',
    contactDepends: ['ndiffusion'],
    intersectLayers: ['metal1', 'ndiffusion'],
  },
  {
    name: 'polysilicon',
    magicName: 'polysilicon',
    color: 'rgb(220, 95, 95)',
    crossY: 85,
    description: 'polycrystalline silicon, used as the gate for MOSFETs',
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
    name: 'polysilicon via',
    magicName: 'polycontact',
    color: '#80ff80',
    crossY: 70,
    crossHeight: 15,
    description: 'connects between polysilicon and metal1',
    contactName: 'met1 contact',
    contactDefault: true,
    contactDepends: ['polysilicon', 'polyres'],
    intersectLayers: ['metal1', 'polysilicon'],
  },
  {
    name: 'metal1',
    magicName: 'metal1',
    color: 'rgb(125, 166, 250)',
    crossY: 55,
    crossHeight: 15,
    description: 'first metal layer used for wiring up the circuit',
    hasLabels: true,
  },
  {
    name: 'mim capacitor',
    magicName: 'mimcap',
    color: 'rgb(100, 100, 100)',
    crossY: 45, // should be just above met1
    crossHeight: 5,
    description: 'thin layer of metal used to form metal-insulator-metal capacitors',
  },
  {
    name: 'metal2 via',
    magicName: 'm2contact',
    color: '#80ff80',
    crossY: 30,
    crossHeight: 25,
    description: 'used to connect between metal1 and metal2 layers',
    contactName: 'met2 contact',
    contactDefault: true,
    contactDepends: ['metal1'],
    intersectLayers: ['metal2', 'metal1'],
  },
  {
    name: 'mim capacitor via',
    magicName: 'mimcapcontact',
    color: '#80ff80',
    crossY: 30,
    crossHeight: 15,
    description: 'connects between mim capacitor and metal2',
    contactName: 'met2 contact',
    contactDepends: ['mimcap'],
    intersectLayers: ['metal2', 'mimcap'],
  },
  {
    name: 'metal2',
    magicName: 'metal2',
    color: 'rgb(125, 200, 250)',
    crossY: 10,
    crossHeight: 20, // bit thicker than met1
    description: 'second metal layer used for wiring up the circuit',
    hasLabels: true,
  },
];
