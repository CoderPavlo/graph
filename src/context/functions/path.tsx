import { INode, } from "../../data/interfaces";
import { TSetLinesState, TSetNodesState, } from "../types/types";

export const selectPathInGraph = (nodesParam: INode[], color: string, setNodesState: TSetNodesState, setLinesState: TSetLinesState): void => {
    setNodesState((prevValue) => {
        return prevValue.map(node => {
            return {
                ...node,
                color: nodesParam.some(paramNode => paramNode.id === node.id) ? color : node.color,
            };
        });
    });
    setLinesState((prevValue)=>{
        return prevValue.map(line=>{
            const source = nodesParam.findIndex(paramNode=> paramNode.id === line.nodesId[0]);
            const target = nodesParam.findIndex(paramNode=> paramNode.id === line.nodesId[1]);
            const selected = source !== -1 && target !==-1 && Math.abs(source-target)===1;
            return {
                ...line,
                color: selected ? color : line.color,
            }
        })
    });
}

export const getPathInGraph = (nodesParam: INode[]) : string => {
    let path = '';
    for (let i = 0; i < nodesParam.length - 1; i++)
        path += nodesParam[i].name + ' - '
    return path + nodesParam[nodesParam.length - 1].name;
}

export const resetPathInGraph = (setNodesState: TSetNodesState, setLinesState: TSetLinesState) => {
    setNodesState((prevValue) => { return prevValue.map(node=>({...node, color: undefined}))});
    setLinesState(prevValue=>{return prevValue.map(line=>({...line, color: undefined}))});
}