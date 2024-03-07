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
    nodesId: [number, number],
    weight: number,
}

export interface IGraph {
    nodes: INode[],
    lines: ILine[],
}

export interface IShortestPath {
    nodes?: string,
    weight?: number,
    time?: number,
}