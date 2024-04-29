import { INode, ILine, IShortestPath, IPath } from "../../data/interfaces";
import { TSetLinesState, TSetNodesState } from "../types/types";
import { delay, getNeighbors } from "./fs";
import { getPathInGraph, resetPathInGraph, selectPathInGraph } from "./path";

interface IDirection {
    one: INode[],
    two: INode[],
    weight: number,
}

const checkNeighbors = (neighbors: IPath[], open: IPath[], closed: IPath[], closed2: IPath[]): IDirection | undefined => {
    for (let neighbor of neighbors) {
        const node = closed2.find(closedNode => closedNode.node.id === neighbor.node.id);
        if (node) {
            node.pointers.reverse();
            return {
                one: [...neighbor.pointers, neighbor.node],
                two: node.pointers,
                weight: neighbor.weight + node.weight,
            };
        }
        else if (!closed.some(closedPath => closedPath.node.id === neighbor.node.id) && !open.some(openedPath => openedPath.node.id === neighbor.node.id)) {
            open.push(neighbor);
        }
    }
    return undefined;
}

export async function bls(sourceNode: INode, targetNode: INode, visualisation: boolean, nodes: INode[], lines: ILine[], setNodesState: TSetNodesState, setLinesState: TSetLinesState): Promise<IShortestPath> {
    let open: IPath[] = [{ node: sourceNode, pointers: [], weight: 0 }]
    let open2: IPath[] = [{ node: targetNode, pointers: [], weight: 0 }]
    let closed: IPath[] = [];
    let closed2: IPath[] = [];
    let directions: IDirection | undefined = undefined;
    const startTime: Date = new Date();
    while (open.length > 0) {
        const currentNode: IPath = open.shift()!;
        closed.push(currentNode);
        const currentNode2: IPath = open2.shift()!;
        closed2.push(currentNode2);
        if (visualisation) {
            resetPathInGraph(setNodesState, setLinesState);
            selectPathInGraph([...currentNode.pointers, currentNode.node], '#1ea54c', setNodesState, setLinesState);
            selectPathInGraph([...currentNode2.pointers, currentNode2.node], 'red', setNodesState, setLinesState);
            await delay(500);
        }
        let neighbors = getNeighbors(currentNode, nodes, lines);
        directions = checkNeighbors(neighbors, open, closed, closed2);
        if (directions) break;
        neighbors = getNeighbors(currentNode2, nodes, lines);
        directions = checkNeighbors(neighbors, open2, closed2, closed);
        if (directions) break;

    }
    if (!directions)
        return {} as IShortestPath;
    else {
        const endTime: Date = new Date();
                resetPathInGraph(setNodesState, setLinesState);
                selectPathInGraph([directions.one[directions.one.length-1],...directions.two], 'red', setNodesState, setLinesState);
                selectPathInGraph(directions.one, '#1ea54c', setNodesState, setLinesState);
                return {
                    nodes: getPathInGraph([...directions.one, ...directions.two]),
                    time: endTime.getTime() - startTime.getTime(),
                    weight: directions.weight,
                } as IShortestPath;
    }
}