import { INode, } from "../../data/interfaces";
import { TSetNodesState, } from "../types/types";

export const selectPathInGraph = (nodesParam: INode[], report: boolean,  setNodesState: TSetNodesState): string | void => {
    setNodesState((prevValue) => {
        return prevValue.map(node => {
            return {
                ...node,
                selected: nodesParam.some(paramNode => paramNode.id === node.id)
            };
        });
    });
    if(report){
        let path = '';
        for (let i = 0; i < nodesParam.length - 1; i++)
            path += nodesParam[i].name + ' - '
        return path + nodesParam[nodesParam.length - 1].name;
    }
}

export const resetPathInGraph = (setNodesState: TSetNodesState) => {
    setNodesState((prevValue) => { return prevValue.map(node=>({...node, selected: undefined}))});
}