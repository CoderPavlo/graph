import { ILine, INode } from "../../data/interfaces";
import { TId, TLinesNodes, TSetLinesAF, TSetNodesAF } from "../types/types";

export const addNodeToGraph = (node: INode, nodes: INode[], setNodes: TSetNodesAF): boolean => {
    if (nodes.some(item => item.id === node.id))
        return false;
    setNodes([...nodes, node]);
    return true;
}


export const deleteNodeFromGraph = (nodeId: TId, nodes: INode[], setNodes: TSetNodesAF, lines: ILine[], setLines: TSetLinesAF) => {
    if (nodeId === undefined) return;
    setNodes(nodes.filter(item => item.id !== nodeId));
    setLines(lines.filter(item => item.nodesId.indexOf(nodeId) === -1));

}

export const readNodesFromLine = (line: ILine, nodes: INode[]): TLinesNodes => {
    const source = nodes.find(node => node.id === line.nodesId[0]);
    const target = nodes.find(node => node.id === line.nodesId[1]);
    return { source, target };
}