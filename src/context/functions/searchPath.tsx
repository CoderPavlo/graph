import { ILine, INode, IShortestPath } from "../../data/interfaces";
import { TSetNodesState, } from "../types/types";
import { selectPathInGraph } from "./path";

interface IPath {
    node: INode,
    pointers: INode[],
    weight: number,
}
function iSShortestPath(current: IPath, paths: IPath[]): boolean {
    //Перевіряє чи шлях вже є в масиві і якщо так то чи довжина менша за наявну в масиві
    return !paths.some(path => path.node.id === current.node.id && path.weight <= current.weight);
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function depthFirstSearch(sourceNode: INode, targetNode: INode, visualisation: boolean, nodes: INode[], lines: ILine[], setNodesState: TSetNodesState): Promise<IShortestPath> {
    let unrevealed: IPath[] = [{ node: sourceNode, pointers: [], weight: 0 }];
    let revealed: IPath[] = [];
    let minWeight = 1e100;
    const startTime: Date = new Date();
    while (unrevealed.length > 0) {
        const currentNode: IPath = unrevealed.pop()!;
        revealed.push(currentNode);
        if (visualisation) {
            selectPathInGraph([...currentNode.pointers, currentNode.node], false, setNodesState);
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
    return {
        nodes: selectPathInGraph(pathNodes, true, setNodesState) as string,
        weight: minWeightPath.weight,
        time: endTime.getTime() - startTime.getTime(),
    };
}

function getNeighbors(current: IPath, nodes: INode[], lines: ILine[]): IPath[] {
    const neighbors: IPath[] = [];
    lines.forEach((line) => {
        const isSourceNode = line.nodesId[0] === current.node.id;
        const isTargetNode = line.nodesId[1] === current.node.id;
        if (isSourceNode || isTargetNode) {
            const nodeId = isSourceNode ? line.nodesId[1] : line.nodesId[0];
            if (current.pointers.find(node => node.id === nodeId) === undefined) {

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