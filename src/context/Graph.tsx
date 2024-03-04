import React from 'react';
import { IGraph, ILine, INode } from '../data/interfaces';
import graph from '../data/graph.json';

interface GraphContextProps {
    nodes: INode[],
    addNode: (node: INode) => boolean;
    lines: ILine[],
    addLine: (line: ILine) => boolean;
    deleteNode: (nodeId: number | undefined) => void,
    deleteLine: (lineId: number | undefined) => void,
    changeLine: (lineId: number | undefined, weight: number) => void,
    resetGraph: () => void,
    deleteGraph: () => void,
    selectPath: (nodesParam: INode[]) => void,
    resetPath: ()=>void,
}

const GraphContext = React.createContext<GraphContextProps | undefined>(undefined);

interface GraphProviderProps {
    children: React.ReactNode;
}

function getDefaultValueNodes(): INode[] {
    const value = window.localStorage.getItem('nodes');
    if (value !== undefined && value !== null && value !== '')
        try {
            return (JSON.parse(value) as INode[])
        }
        catch {
            writeLocalStorage();
        }
    return (graph as IGraph).nodes;
}

function getDefaultValueLines(): ILine[] {
    const value = window.localStorage.getItem('lines');
    if (value !== undefined && value !== null && value !== '')
        try {
            return (JSON.parse(value) as ILine[])
        }
        catch {
            writeLocalStorage();
        }
    return (graph as IGraph).lines;
}

function writeLocalStorage() {
    window.localStorage.setItem('nodes', JSON.stringify((graph as IGraph).nodes));
    window.localStorage.setItem('lines', JSON.stringify((graph as IGraph).lines));
}

export function GraphProvider({ children }: GraphProviderProps) {

    const [nodes, setNodesState] = React.useState<INode[]>(getDefaultValueNodes());
    const [lines, setLinesState] = React.useState<ILine[]>(getDefaultValueLines());

    const setNodes = (nodes: INode[]) => {
        setNodesState(nodes);
        window.localStorage.setItem('nodes', JSON.stringify(nodes));
    }

    const setLines = (lines: ILine[]) => {
        setLinesState(lines);
        window.localStorage.setItem('lines', JSON.stringify(lines));
    }

    const addNode = (node: INode): boolean => {
        if (nodes.some(item => item.id === node.id))
            return false;
        setNodes([...nodes, node]);
        return true;
    }

    const addLine = (line: ILine): boolean => {
        if (line.source.id === line.target.id ||
            lines.some(item => (item.source.id === line.source.id && item.target.id === line.target.id) ||
                (item.source.id === line.target.id && item.target.id === line.source.id)))
            return false;
        setLines([...lines, line]);
        return true;
    }

    const deleteNode = (nodeId: number | undefined) => {
        setNodes(nodes.filter(item => item.id !== nodeId));
        setLines(lines.filter(item => item.target.id !== nodeId && item.source.id !== nodeId));
    }

    const deleteLine = (lineId: number | undefined) => {
        setLines(lines.filter(item => item.id !== lineId));
    }

    const changeLine = (lineId: number | undefined, weight: number) => {
        const newLines = lines.map(item => {
            if (item.id === lineId)
                return { ...item, weight: weight };
            return item;
        });
        setLines(newLines);
    }

    const resetGraph = () => {
        setNodes((graph as IGraph).nodes);
        setLines((graph as IGraph).lines);
    }

    const deleteGraph = () => {
        setLines([]);
        setNodes([]);
    }


    const selectPath = (nodesParam: INode[]) => {
        setNodesState((prevValue) => {
            return prevValue.map(node => {
                const isSelected = nodesParam.some(paramNode => paramNode.id === node.id);
                return {
                    ...node,
                    selected: isSelected
                };
            });
        });
        if (nodesParam.length < 2) return;
        setLinesState(prevLines => {
            const array = [...prevLines];
            for (let i = 0; i < nodesParam.length - 1; i++) {
              const index = array.findIndex(line => 
                (line.source.id === nodesParam[i].id && line.target.id === nodesParam[i + 1].id) ||
                (line.source.id === nodesParam[i + 1].id && line.target.id === nodesParam[i].id)
              );
          
              if (index !== -1) {
                array[index].selected = true;
              }
            }
            return array;
          });
    }

    const reset = (array: (INode | ILine)[]): (INode | ILine)[] => {
        return array.map(item => {
          return { ...item, selected: undefined };
        });
      };

    const resetPath = () => {
        setNodesState((prevValue)=> {return reset(prevValue) as INode[];});
        setLinesState((prevValue)=> {return reset(prevValue) as ILine[];});
    }

    return (
        <GraphContext.Provider value={{ nodes, addNode, lines, addLine, deleteNode, deleteLine, changeLine, resetGraph, deleteGraph, selectPath, resetPath}}>
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