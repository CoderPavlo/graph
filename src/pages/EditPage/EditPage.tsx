import React from 'react'
import { Box, Button, Autocomplete, TextField, Typography, Divider, ButtonGroup } from '@mui/material';
import { INode } from '../../data/interfaces';

import ua_cities from '../../data/ua_cities.json';

import { useGraph } from '../../context/Graph';


export default function EditPage() {

    const { nodes, addNode, addLine, lines, resetGraph, deleteGraph } = useGraph();

    const [node, setNode] = React.useState<INode | null>(null);
    const [shortName, setShortName] = React.useState<string>('');

    const [nodeError, setNodeError] = React.useState<boolean>(false);

    const [source, setSource] = React.useState<INode | null>(null);
    const [target, setTarget] = React.useState<INode | null>(null);
    const [lineError, setLineError] = React.useState<boolean>(false);

    const [weight, setWeight] = React.useState<string>('');
    const [weightError, setWeightError] = React.useState<boolean>(false);


    const addNodeToGraph = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (node === null || shortName === '') {
            setNodeError(true);
            return;
        }
        setNodeError(!addNode({ ...node, shortName }));
        setNode(null);
        setShortName('');
    }

    const addLineToGraph = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (source === null || target === null) {
            setLineError(true);
            return;
        }
        setLineError(!addLine({
            id: lines.length > 0 ? lines[lines.length - 1].id + 1 : 0,
            source: source,
            target: target,
            weight: Number(weight),
        }));
        setSource(null);
        setTarget(null);
        setWeight('');
    }

    async function saveAsJson() {
        try {
            const graph = {
                nodes: nodes,
                lines: lines,
            }
            const jsonString = JSON.stringify(graph);
            const blob = new Blob([jsonString], { type: 'application/json' });

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'graph.json';

            document.body.appendChild(downloadLink);
            downloadLink.click();

            document.body.removeChild(downloadLink);

        } catch (error) {
            console.log('Помилка збереження json', error);
        }
    }

    return (
        <>
            <Typography variant='h6' mt={2} mb={1}>
                Додавання вершини
            </Typography>
            <Autocomplete
                sx={{ marginBlock: '20px' }}
                disablePortal
                id="city-select"
                options={ua_cities as INode[]}
                fullWidth
                value={node}
                onChange={(e, value) => setNode(value)}
                renderInput={(params) => <TextField {...params} label="Вершина" />}
                noOptionsText='Немає вершин'
            />
            <TextField fullWidth id="short-name" label="Коротка назва" variant="outlined" value={shortName}
                sx={{ marginBottom: nodeError ? '10px' : '20px' }}
                onChange={(e) => setShortName(e.target.value)}
                disabled={!node} />
            {nodeError &&
                <Typography variant='body2' color='error'>
                    Така вершина вже існує
                </Typography>
            }
            <Box width='100%' display='flex' justifyContent='center' mb='10px'>
                <Button disabled={node === null} onClick={addNodeToGraph}>Додати</Button>
            </Box>
            <Divider />
            <Typography variant='h6' mt={2} mb={1}>
                Додавання Ребра
            </Typography>
            <Autocomplete
                sx={{ marginBlock: '20px' }}
                disablePortal
                id="source-select"
                options={nodes}
                fullWidth
                value={source}
                onChange={(e, value) => setSource(value)}
                renderInput={(params) => <TextField {...params} label="Вершина 1" />}
                noOptionsText='Немає вершин'
            />
            <Autocomplete
                sx={{ marginBlock: '20px' }}
                disablePortal
                id="target-select"
                options={nodes}
                fullWidth
                value={target}
                onChange={(e, value) => setTarget(value)}
                renderInput={(params) => <TextField {...params} label="Вершина 2" />}
                noOptionsText='Немає вершин'
            />
            <TextField fullWidth id="outlined-basic" label="Вага" variant="outlined" value={weight}
                onChange={(e) => {
                    if (isNaN(Number(e.target.value)))
                        setWeightError(true);
                    else {
                        setWeightError(false);
                        setWeight(e.target.value);
                    }
                }}
                error={weightError} />

            {lineError &&
                <Typography variant='body2' color='error' mt='10px'>
                    Таке ребро вже існує
                </Typography>
            }
            <Box width='100%' display='flex' justifyContent='center' mb='10px' mt={lineError ? '10px' : '20px'}>
                <Button disabled={source === null || target === null || weight === ''} onClick={addLineToGraph}>Додати</Button>
            </Box>
            <Divider />
            <Typography variant='h6' mt={2} mb={1}>
                Керування графом
            </Typography>
            <ButtonGroup variant="outlined" aria-label="graph managment" sx={{ mt: 2 }} fullWidth>
                <Button onClick={saveAsJson}>Зберегти як JSON</Button>
                <Button onClick={resetGraph}>Скинути</Button>
                <Button onClick={deleteGraph}>Видалити</Button>
            </ButtonGroup>
        </>
    )
}
