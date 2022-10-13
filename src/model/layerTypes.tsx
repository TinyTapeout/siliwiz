export interface ILayerInfo {
  name: string;
  color: string;
}

export const layerTypes: ILayerInfo[] = [
  { name: 'P SUB', color: '#ffff00' },
  { name: 'N DIFF', color: '#8080ff' },
  { name: 'POLY', color: '#ff8080' },
  { name: 'CONTACT', color: '#80ff80' },
];
