export interface IRoomModel {
    name: string;
    attributes: IAttribute[];
}

export interface IAttribute {
    name: string;
    value: string;
    defaultValue: string;
}
