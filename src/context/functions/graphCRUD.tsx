import { IGraph} from "../../data/interfaces";
import graph from '../../data/graph.json';
import { TKey, TSetLinesAF, TSetNodesAF } from "../types/types";

function writeGraph() {
  window.localStorage.setItem('nodes', JSON.stringify((graph as IGraph).nodes));
  window.localStorage.setItem('lines', JSON.stringify((graph as IGraph).lines));
}

export function getDefaultValue<T>(key: TKey): T[] {
  const defaultValue = key === 'nodes' ? (graph as IGraph).nodes : (graph as IGraph).lines;

  const value = window.localStorage.getItem(key);

  if (value) {
    try {
      return JSON.parse(value) as T[];
    } catch {
      writeGraph();
    }
  }

  return defaultValue as T[];
}

export const writeLocalStorage = <T,>(
  key: TKey,
  data: T[],
  setData: React.Dispatch<React.SetStateAction<T[]>>
) => {
  setData(data);
  window.localStorage.setItem(key, JSON.stringify(data));
};

export type TGraphChangeAF = (setNodes: TSetNodesAF, setLines: TSetLinesAF) => void;

export const resetGraphValues: TGraphChangeAF = (setNodes, setLines) => {
  setNodes((graph as IGraph).nodes);
  setLines((graph as IGraph).lines);
}

export const deleteGraphValues: TGraphChangeAF = (setNodes, setLines) => {
  setLines([]);
  setNodes([]);
}