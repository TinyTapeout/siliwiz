// SPDX-License-Identifier: Apache-2.0

export interface IViaLayerVariation {
  /**
   * What other layer this via layer variation depends on (for multiple layers, we'll look for a single match).
   * Use the "magicName" of the target layer(s) here.
   */
  dependsOn: string[];

  /** The name of the layer in "magic" VLSI */
  magicName: string;

  /** The y-position of the layer variation in the Cross Section view */
  crossY: number;

  /** The height of the layer variation in the Cross Section view */
  crossHeight: number;
  description?: string;
}

export interface ILayerInfo {
  /* The name of the layer, as displayed to the user */
  name: string;

  /** The name of the layer in "magic" VLSI */
  magicName: string;

  /** The color of the layer in the Canvas and Cross Section views */
  color: string;

  /** Whether this layer is hatched in the Canvas and Cross Section views */
  hatched?: boolean;

  /** The y-position of the layer in the Cross Section view */
  crossY: number;

  /** The height of the layer in the Cross Section view */
  crossHeight: number;

  description?: string;

  /** Whether this layer is masked by polysilicon */
  masked?: boolean;

  /** For via layers, the may have several variations when extracting / drawing in x-section */
  viaVariations?: IViaLayerVariation[];

  /** Whether this layer supports labels (e.g. a metal layer) */
  hasLabels?: boolean;
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
    name: 'metal1 via',
    color: '#80ff80',
    magicName: 'polycontact', // fallback value, if no variation below matches
    crossY: 70,
    crossHeight: 15,
    viaVariations: [
      {
        dependsOn: ['nwell'],
        magicName: 'nsubstratencontact',
        crossY: 70,
        crossHeight: 30,
        description: 'used to connect between n well and metal1',
      },
      {
        dependsOn: ['pmos'],
        magicName: 'psubstratepcontact',
        crossY: 70,
        crossHeight: 30,
        description: 'used to connect between p substrate and metal1',
      },
      {
        dependsOn: ['pdiffusion'],
        magicName: 'pdcontact',
        crossY: 70,
        crossHeight: 30,
        description: 'used to connect between p diffusion and metal1',
      },
      {
        dependsOn: ['ndiffusion'],
        magicName: 'ndcontact',
        crossY: 70,
        crossHeight: 30,
        description: 'used to connect between n diffusion and metal1',
      },
      {
        dependsOn: ['polysilicon', 'polyres'],
        magicName: 'polycontact',
        crossY: 70,
        crossHeight: 15,
        description: 'connects between polysilicon and metal1',
      },
    ],
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
    magicName: 'm2contact', // fallback value, if no variation below matches
    color: '#80ff80',
    crossY: 30,
    crossHeight: 25,
    description: 'used to connect between metal1 and metal2 layers',
    viaVariations: [
      {
        dependsOn: ['metal1'],
        magicName: 'm2contact',
        crossY: 30,
        crossHeight: 25,
        description: 'connects between metal1 and metal2',
      },
      {
        dependsOn: ['mimcap'],
        magicName: 'mimcapcontact',
        crossY: 30,
        crossHeight: 15,
        description: 'connects between mim capacitor and metal2',
      },
    ],
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
