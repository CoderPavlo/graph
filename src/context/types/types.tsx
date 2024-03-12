import { ILine, INode, IShortestPath } from "../../data/interfaces";

export type TId = number | undefined;
export type TAlgoritm = 'dfs' | 'bfs'
export type TLinesNodes = {
    source?: INode,
    target?: INode,
}

export type TAddLineAF = (line: ILine) => boolean;
export type TAddNodeAF = (node: INode) => boolean;
export type TDeleteAF = (Id: TId) => void;
export type TUpdateLineAF = (lineId: TId, weight: number) => void;
export type TGetNodesAF = (line: ILine) => TLinesNodes;
export type TSelectPathAF = (nodesParam: INode[], report: boolean) => string | void;
export type TAF = () => void;
export type TSspAF = (source: INode, target: INode, visualisation: boolean, algorithm: TAlgoritm) => Promise<IShortestPath>;
export type TKey = 'nodes' | 'lines';

export type TSetNodesAF = (nodes: INode[]) => void;
export type TSetLinesAF = (lines: ILine[]) => void;

export type TSetNodesState = React.Dispatch<React.SetStateAction<INode[]>>;
export type TSetLinesState = React.Dispatch<React.SetStateAction<ILine[]>>;


