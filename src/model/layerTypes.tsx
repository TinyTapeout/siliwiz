export interface ILayerInfo {
  name: string;
  color: string;
  hatched?: boolean;
  crossY: number;
  crossHeight: number;
}

export const layerTypes: ILayerInfo[] = [
  { name: 'P SUB', color: '#cccc00', hatched: true, crossY: 0, crossHeight: 200 },
  { name: 'N DIFF', color: '#8080ff', crossY: 80, crossHeight: 20 },
  { name: 'POLY', color: '#ff8080', crossY: 70, crossHeight: 10 },
  { name: 'CONTACT', color: '#80ff80', crossY: 70, crossHeight: 10 },
];
