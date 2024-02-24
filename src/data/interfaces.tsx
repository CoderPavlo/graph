export interface INode {
    id: number,
    name: string,
    label: string,
    lng: number,
    lat: number,
    district: string,
    state: string,
}

export interface ILine {
    id: number,
    source: INode,
    target: INode,
    weight: number,
}

export interface IGraph {
    nodes: INode[],
    lines: ILine[],
}