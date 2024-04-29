import { INode, ILine, IShortestPath, IPath } from "../../data/interfaces";
import { TSetLinesState, TSetNodesState } from "../types/types";
import { delay, getNeighbors } from "./fs";
import { getPathInGraph, resetPathInGraph, selectPathInGraph } from "./path";


export async function uls(sourceNode: INode, targetNode: INode, visualisation: boolean, nodes: INode[], lines: ILine[], setNodesState: TSetNodesState, setLinesState: TSetLinesState): Promise<IShortestPath> {
    let open: IPath[] = [{ node: sourceNode, pointers: [], weight: 0 }]
    let closed: IPath[] = [];
    const startTime: Date = new Date();
    while (open.length > 0) {
        const currentNode: IPath = open.shift()!;
        closed.push(currentNode);
        if (visualisation) {
            resetPathInGraph(setNodesState, setLinesState);
            selectPathInGraph([...currentNode.pointers, currentNode.node], '#1ea54c', setNodesState, setLinesState);
            await delay(500);
        }
        const neighbors = getNeighbors(currentNode, nodes, lines);
        for (let neighbor of neighbors) {
            if (neighbor.node.id === targetNode.id) {
                const endTime: Date = new Date();
                resetPathInGraph(setNodesState, setLinesState);
                selectPathInGraph([...neighbor.pointers, neighbor.node], '#1ea54c', setNodesState, setLinesState);
                return {
                    nodes: getPathInGraph([...neighbor.pointers, neighbor.node]),
                    time: endTime.getTime() - startTime.getTime(),
                    weight: neighbor.weight,
                } as IShortestPath;
            }
            else if (!closed.some(closedPath => closedPath.node.id === neighbor.node.id) && !open.some(openedPath=>openedPath.node.id === neighbor.node.id)) {
                open.push(neighbor);
            }
        }

    }
    return {} as IShortestPath;
}