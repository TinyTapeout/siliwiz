export interface ILayerInfo {
  name: string;
  magicName: string;
  color: string;
  hatched?: boolean;
  crossY: number;
  crossHeight: number;
}

export const layerTypes: ILayerInfo[] = [
  {
    name: 'P SUB',
    magicName: 'pmos',
    color: '#cccc00',
    hatched: true,
    crossY: 80,
    crossHeight: 200,
  },
  // { name: 'N DIFF', magicName: 'ndiff', color: '#8080ff', crossY: 80, crossHeight: 20 },
  // { name: 'POLY', magicName: 'poly', color: '#ff8080', crossY: 70, crossHeight: 10 },
  // { name: 'CONTACT', magicName: 'polycont', color: '#80ff80', crossY: 70, crossHeight: 10 },

  {
    name: 'ntransistor',
    magicName: 'ntransistor',
    color: 'rgb(169, 131, 101)',
    crossY: 80,
    crossHeight: 20,
  },
  {
    name: 'ptransistor',
    magicName: 'ptransistor',
    color: 'rgb(184,  73, 83)',
    crossY: 80,
    crossHeight: 20,
  },
  {
    name: 'nwell',
    magicName: 'nwell',
    color: 'gray',
    crossY: 80,
    crossHeight: 20,
    hatched: true,
  },
  { name: 'ndiffusion', magicName: 'ndiffusion', color: '#8080ff', crossY: 70, crossHeight: 10 },
  { name: 'pdiffusion', magicName: 'pdiffusion', color: '#4040ff', crossY: 70, crossHeight: 10 },
  { name: 'pdcontact', magicName: 'pdcontact', color: '#ffff80', crossY: 70, crossHeight: 10 },
  { name: 'ndcontact', magicName: 'ndcontact', color: '#ff80ff', crossY: 70, crossHeight: 10 },
  {
    name: 'nsubstratencontact',
    magicName: 'nsubstratencontact',
    color: 'purple',
    crossY: 70,
    crossHeight: 10,
  },
  {
    name: 'psubstratepcontact',
    magicName: 'psubstratepcontact',
    color: 'orange',
    crossY: 70,
    crossHeight: 10,
  },
  {
    name: 'polysilicon',
    magicName: 'polysilicon',
    color: 'rgb(220, 95, 95)',
    crossY: 70,
    crossHeight: 10,
  },
  { name: 'polycontact', magicName: 'polycontact', color: '#80ff80', crossY: 60, crossHeight: 10 },
  { name: 'metal1', magicName: 'metal1', color: 'rgb(125, 166, 250)', crossY: 50, crossHeight: 10 },
];
