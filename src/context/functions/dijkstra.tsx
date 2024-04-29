import { INode, ILine, IShortestPath } from "../../data/interfaces";
import { TSetNodesState, TSetLinesState } from "../types/types";
import { delay } from "./fs";
import { getPathInGraph, resetPathInGraph, selectPathInGraph } from "./path";

export async function dijkstra(sourceNode: INode, targetNode: INode, visualisation: boolean, nodes: INode[], lines: ILine[], setNodesState: TSetNodesState, setLinesState: TSetLinesState): Promise<IShortestPath> {
     const distances: { [key: number]: number } = {};
     const previous: { [key: number]: number | null } = {};
     const visited: { [key: number]: boolean } = {};
 
     nodes.forEach((node) => {
         distances[node.id] = node.id === sourceNode.id ? 0 : Infinity;
         previous[node.id] = null;
     });
     let currentNodeId: number = sourceNode.id;
     
    const startTime: Date = new Date();
     while (currentNodeId !=null) {
        if(visualisation){
            selectPath(sourceNode, currentNodeId, nodes, previous, false, setNodesState, setLinesState);
            await delay(500);
        }
        
         visited[currentNodeId] = true;
         const currentNode = nodes.find((node) => node.id === currentNodeId);
 
         if (!currentNode) {
             break;
         }
 
         const currentLineIds = lines
             .filter((line) => line.nodesId.includes(currentNodeId as number))
             .map((line) => line.id);
 
         currentLineIds.forEach((lineId) => {
             const line = lines.find((line) => line.id === lineId);
 
             if (!line) {
                 return;
             }
 
             const neighborNodeId = line.nodesId.find((id) => id !== currentNodeId);
 
             if (!neighborNodeId || visited[neighborNodeId]) {
                 return;
             }
 
             const distanceToNeighbor = distances[currentNodeId] + (line.weight || 0);
 
             if (distanceToNeighbor < distances[neighborNodeId]) {
                 distances[neighborNodeId] = distanceToNeighbor;
                 previous[neighborNodeId] = currentNodeId;
             }
         });
 
         let smallestDistance = Infinity;
         let nextNodeId = null;
 
         Object.entries(distances).forEach(([nodeId, distance]) => {
             const id = parseInt(nodeId);
             if (!visited[id] && distance < smallestDistance) {
                 smallestDistance = distance;
                 nextNodeId = id;
             }
         });
         if(!nextNodeId) break;
         currentNodeId = nextNodeId;
     }
     const endTime: Date = new Date();
 
     const path = selectPath(sourceNode, targetNode.id, nodes, previous, true, setNodesState, setLinesState);
 
     return {
        nodes: getPathInGraph(path as INode[]),
        weight: distances[targetNode.id],
        time: endTime.getTime() - startTime.getTime(),
     };
}

const selectPath = (sourceNode:INode, targetId:number, nodes: INode[], previous: { [key: number]: number | null }, report: boolean, setNodesState: TSetNodesState, setLinesState: TSetLinesState):INode[] | void =>{
    const path: INode[] = [];
     let current = targetId;
     while (current !== sourceNode.id && previous[current] !== null) {
        const node = nodes.find(node=>node.id===current);
        if(node)
         path.unshift(node);
         current = previous[current] as number;
     }
     path.unshift(sourceNode);

    resetPathInGraph(setNodesState, setLinesState);
    selectPathInGraph(path, '#1ea54c', setNodesState, setLinesState);
    if(report) return path;
}