import { ILine, INode, IShortestPath, IPath } from "../../data/interfaces";
import { TAlgoritm, TSetLinesState, TSetNodesState, } from "../types/types";
import { getPathInGraph, resetPathInGraph, selectPathInGraph } from "./path";

function iSShortestPath(current: IPath, paths: IPath[]): boolean {
    //Перевіряє чи шлях вже є в масиві і якщо так то чи довжина менша за наявну в масиві
    return !paths.some(path => path.node.id === current.node.id && path.weight <= current.weight);
}

export async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



export async function fs(sourceNode: INode, targetNode: INode, visualisation: boolean, algorithm: TAlgoritm, nodes: INode[], lines: ILine[], setNodesState: TSetNodesState, setLinesState: TSetLinesState): Promise<IShortestPath> {
    let unrevealed: IPath[] = [{ node: sourceNode, pointers: [], weight: 0 }];
    let revealed: IPath[] = [];
    let minWeight = 1e100;
    const startTime: Date = new Date();
    while (unrevealed.length > 0) {
        const currentNode: IPath = algorithm==='dfs' ? unrevealed.pop()! : unrevealed.shift()!;
        revealed.push(currentNode);
        if (visualisation) {
            resetPathInGraph(setNodesState, setLinesState);
            selectPathInGraph([...currentNode.pointers, currentNode.node], '#1ea54c', setNodesState, setLinesState);
            await delay(500);
        }
        if (targetNode.id === currentNode.node.id) {
            if (minWeight > currentNode.weight) minWeight = currentNode.weight;
        }
        else {
            const neighbors = getNeighbors(currentNode, nodes, lines);
            neighbors.forEach((neighbor) => {
                if (neighbor.weight < minWeight && iSShortestPath(neighbor, revealed) && iSShortestPath(neighbor, unrevealed))
                    unrevealed.push(neighbor);
            });
        }
    }
    const endTime: Date = new Date();
    const pathsToTarget = revealed.filter(path => path.node.id === targetNode.id);
    const minWeightPath = pathsToTarget.reduce((minPath, path) => (path.weight < minPath.weight ? path : minPath), pathsToTarget[0]);
    const pathNodes = [...minWeightPath.pointers, minWeightPath.node];
    resetPathInGraph(setNodesState, setLinesState);
    selectPathInGraph(pathNodes, '#1ea54c', setNodesState, setLinesState);
    return {
        nodes: getPathInGraph(pathNodes),
        weight: minWeightPath.weight,
        time: endTime.getTime() - startTime.getTime(),
    };
}

export function getNeighbors(current: IPath, nodes: INode[], lines: ILine[]): IPath[] {
    const neighbors: IPath[] = [];
    lines.forEach((line) => {
        const isSourceNode = line.nodesId[0] === current.node.id;
        const isTargetNode = line.nodesId[1] === current.node.id;
        if (isSourceNode || isTargetNode) {
            const nodeId = isSourceNode ? line.nodesId[1] : line.nodesId[0];
            if (!current.pointers.some(node => node.id === nodeId)){

                const node = nodes.find(item => item.id === nodeId);
                if (node)
                    neighbors.push({
                        node: node,
                        pointers: [...current.pointers, current.node],
                        weight: current.weight + line.weight,
                    });
            }
        }
    });
    return neighbors;
}