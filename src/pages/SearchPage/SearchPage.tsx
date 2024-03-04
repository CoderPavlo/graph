import React from 'react'
import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { useGraph } from '../../context/Graph';
import { ILine, INode } from '../../data/interfaces';


export default function SearchPage() {
    const { nodes, lines, selectPath, resetPath} = useGraph();
    const [sourceNode, setSourceNode] = React.useState<INode | null>(null);
    const [targetNode, setTargetNode] = React.useState<INode | null>(null);

    interface IPath {
        node: INode,
        pointers: INode[],
        weight: number,
    }

    function iSShortestPath(current: IPath, paths: IPath[]): boolean{
        //Перевіряє чи шлях вже є в масиві і якщо так то чи довжина менша за наявну в масиві
        return !paths.some(path=>path.node.id === current.node.id && path.weight <= current.weight);
    }

    async function dfs() {
        resetPath();
        if (!sourceNode || !targetNode) {
            console.error("Start or target node not found");
            return null;
        }
        let unrevealed: IPath[] = [{ node: sourceNode, pointers: [], weight: 0 }];
        let revealed: IPath[] = [];

        while (unrevealed.length > 0) {
            const currentNode: IPath = unrevealed.pop()!;
            revealed.push(currentNode);

            if (targetNode.id !== currentNode.node.id) {
                const neighbors = getNeighbors(currentNode);
                neighbors.forEach((neighbor) => {
                    if (iSShortestPath(neighbor, revealed) && iSShortestPath(neighbor, unrevealed))
                        unrevealed.push(neighbor);
                });
            }
        }
        const pathsToTarget = revealed.filter(path => path.node.id === targetNode.id);
        const minWeightPath = pathsToTarget.reduce((minPath, path) => (path.weight < minPath.weight ? path : minPath), pathsToTarget[0]);
        const path=[...minWeightPath.pointers, minWeightPath.node];
        console.log(path);
        selectPath(path);
    }

    function getNeighbors(current: IPath): IPath[] {
        const neighbors: IPath[] = [];
        lines.forEach((line) => {
            const isSourceNode = line.source.id === current.node.id;
            const isTargetNode = line.target.id === current.node.id;
            if (isSourceNode || isTargetNode) {
                const node= isSourceNode ? line.target : line.source;
                if (current.pointers.length < 1 || node.id !== current.pointers[current.pointers.length - 1].id) {
                    neighbors.push({
                        node: isSourceNode ? line.target : line.source,
                        pointers: [...current.pointers, current.node],
                        weight: current.weight + line.weight,
                    });
                }
            }
        });
        return neighbors;
    }


    return (
        <>
            <Typography variant='h6' mt={2} mb={1}>
                Пошук
            </Typography>
            <Autocomplete
                sx={{ marginBlock: '20px' }}
                disablePortal
                id="source-select"
                options={nodes}
                fullWidth
                value={sourceNode}
                onChange={(e, value) => setSourceNode(value)}
                renderInput={(params) => <TextField {...params} label="Початкова вершина" />}
                noOptionsText='Немає вершин'
                isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Autocomplete
                sx={{ marginBlock: '20px' }}
                disablePortal
                id="target-select"
                options={nodes}
                fullWidth
                value={targetNode}
                onChange={(e, value) => setTargetNode(value)}
                renderInput={(params) => <TextField {...params} label="Цільова вершина" />}
                noOptionsText='Немає вершин'
                isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <FormControl sx={{ mb: '20px' }}>
                <FormLabel id="radio-buttons-group-label">Алгоритм</FormLabel>
                <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    defaultValue={0}
                    name="radio-buttons-group"
                >
                    <FormControlLabel value={0} control={<Radio />} label="Пошук вглиб" />
                </RadioGroup>
            </FormControl>
            <Box width='100%' display='flex' justifyContent='center' mb='10px'>
                <Button disabled={sourceNode === null || targetNode === null} onClick={dfs}>Виконати</Button>
            </Box>
        </>
    )
}
