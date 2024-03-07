import { ILine, } from "../../data/interfaces";
import { TId, TSetLinesAF } from "../types/types";


export const addLineToGraph = (line: ILine, lines: ILine[], setLines: TSetLinesAF) => {
    if (line.nodesId[0] === line.nodesId[1] ||
        lines.some(item => item.nodesId.sort().every((id, index) => id === line.nodesId.sort()[index])))
        return false;
    setLines([...lines, line]);
    return true;
}

export const deleteLineFromGraph = (lineId: TId, lines: ILine[], setLines: TSetLinesAF) => {
    setLines(lines.filter(item => item.id !== lineId));
}

export const updateLineInGraph = (lineId: TId, weight: number, lines: ILine[], setLines: TSetLinesAF) => {
    const newLines = lines.map(item => {
        if (item.id === lineId)
            return { ...item, weight: weight };
        return item;
    });
    setLines(newLines);
}
