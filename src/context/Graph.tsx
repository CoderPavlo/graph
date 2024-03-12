import React from 'react';
import { ILine, INode } from '../data/interfaces';
import { deleteGraphValues, getDefaultValue, resetGraphValues, writeLocalStorage } from './functions/graphCRUD';
import { addLineToGraph, deleteLineFromGraph, updateLineInGraph } from './functions/lineCRUD';
import { addNodeToGraph, deleteNodeFromGraph, readNodesFromLine } from './functions/nodeCRUD';
import { resetPathInGraph, selectPathInGraph } from './functions/path';

import { TAF, TAddLineAF, TAddNodeAF, TDeleteAF, TGetNodesAF, TSelectPathAF, TSspAF, TUpdateLineAF } from "./types/types";
import { searchPath } from './functions/searchPath';

interface IGraphContextProps {
    nodes: INode[],
    lines: ILine[],

    addLine: TAddLineAF;
    deleteLine: TDeleteAF,
    updateLine: TUpdateLineAF,
    addNode: TAddNodeAF;
    deleteNode: TDeleteAF,
    getNodesFromLine: TGetNodesAF,
    resetGraph: TAF,
    deleteGraph: TAF,
    selectPath: TSelectPathAF,
    resetPath: TAF,
    searchShortestPath: TSspAF,
}

const GraphContext = React.createContext<IGraphContextProps | undefined>(undefined);

interface IGraphProviderProps {
    children: React.ReactNode;
}

export function GraphProvider({ children }: IGraphProviderProps) {

    const [nodes, setNodesState] = React.useState<INode[]>(getDefaultValue('nodes'));
    const [lines, setLinesState] = React.useState<ILine[]>(getDefaultValue('lines'));

    const setNodes = (nodes: INode[]) => writeLocalStorage('nodes', nodes, setNodesState);
    const setLines = (lines: ILine[]) => writeLocalStorage('lines', lines, setLinesState);

    const addLine: TAddLineAF = (line) => addLineToGraph(line, lines, setLines);
    const deleteLine: TDeleteAF = (lineId) => deleteLineFromGraph(lineId, lines, setLines);
    const updateLine: TUpdateLineAF = (lineId, weight) => updateLineInGraph(lineId, weight, lines, setLines);

    const addNode: TAddNodeAF = (node) => addNodeToGraph(node, nodes, setNodes);
    const deleteNode: TDeleteAF = (nodeId) => deleteNodeFromGraph(nodeId, nodes, setNodes, lines, setLines);
    const getNodesFromLine: TGetNodesAF = (line) => readNodesFromLine(line, nodes);

    const resetGraph = () => resetGraphValues(setNodes, setLines);
    const deleteGraph = () => deleteGraphValues(setNodes, setLines);

    const selectPath: TSelectPathAF = (nodesParam, report) => selectPathInGraph(nodesParam, report, setNodesState);
    const resetPath = () => resetPathInGraph(setNodesState);

    const searchShortestPath: TSspAF = async (source, target, visualisation, algorithm) => searchPath(source, target, visualisation, algorithm, nodes, lines, setNodesState);
    return (
        <GraphContext.Provider
            value={{
                nodes,
                lines,
                addLine,
                deleteLine,
                updateLine,
                addNode,
                deleteNode,
                getNodesFromLine,
                resetGraph,
                deleteGraph,
                selectPath,
                resetPath,
                searchShortestPath,
            }}>
            {children}
        </GraphContext.Provider>
    );
}

export function useGraph() {
    const context = React.useContext(GraphContext);
    if (!context) {
        throw new Error();
    }
    return context;
}
