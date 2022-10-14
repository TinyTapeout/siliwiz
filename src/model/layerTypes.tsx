export interface ILayerInfo {
  name: string;
  color: string;
  hatched?: boolean;
}

export const layerTypes: ILayerInfo[] = [
  { name: 'P SUB', color: '#cccc00', hatched: true },
  { name: 'N DIFF', color: '#8080ff' },
  { name: 'POLY', color: '#ff8080' },
  { name: 'CONTACT', color: '#80ff80' },
];
