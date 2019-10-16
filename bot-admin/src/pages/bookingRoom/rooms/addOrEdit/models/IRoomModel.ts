export interface IRoomModel {
  name: string;
  attributes: Attribute[];
}

export interface Attribute {
  name: string;
  value: string;
  defaultValue: string;
}
