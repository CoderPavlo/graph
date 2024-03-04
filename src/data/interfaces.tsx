export interface INode {
    id: number,
    name: string,
    shortName: string,
    label: string,
    lng: number,
    lat: number,
    district: string,
    state: string,
    selected?: boolean,
}

export interface ILine {
    id: number,
    source: INode,
    target: INode,
    weight: number,
    selected?: boolean,
}

export interface IGraph {
    nodes: INode[],
    lines: ILine[],
}