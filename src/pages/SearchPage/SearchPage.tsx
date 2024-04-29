import React from 'react'
import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material'
import { useGraph } from '../../context/Graph';
import { INode, IShortestPath } from '../../data/interfaces';

import { useTheme } from '@mui/material/styles';
import { TAlgoritm } from '../../context/types/types';

export interface ISearchSettings {
    source: INode | null,
    target: INode | null,
    algorithm: TAlgoritm,
    visualisation: boolean,
}
export default function SearchPage() {
    const theme = useTheme();
    const { nodes, resetPath, searchShortestPath } = useGraph();

    const [path, setPath] = React.useState<IShortestPath>({});
    const [settings, setSettings] = React.useState<ISearchSettings>({ source: null, target: null, algorithm: 'dfs', visualisation: false });

    function changeSettings(key: 'source' | 'target' | 'algorithm' | 'visualisation', value: INode | TAlgoritm | boolean | null) {
        setPath({});
        resetPath();
        setSettings((prevValue) => {
            return {
                ...prevValue,
                [key]: value,
            };
        });
    }

    async function search() {
        setPath({});
        if (!settings.source || !settings.target) return;
        const shortestPath: IShortestPath = await searchShortestPath(settings.source, settings.target, settings.visualisation, settings.algorithm);
        setPath(shortestPath);
    }

    React.useEffect(() => {
        return () => {
            resetPath();
        };
    }, []);


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
                value={settings.source}
                onChange={(e, value) => changeSettings('source', value)}
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
                value={settings.target}
                onChange={(e, value) => changeSettings('target', value)}
                renderInput={(params) => <TextField {...params} label="Цільова вершина" />}
                noOptionsText='Немає вершин'
                isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <FormControl sx={{ mb: '10px' }}>
                <FormLabel id="radio-buttons-group-label">Алгоритм</FormLabel>
                <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={settings.algorithm}
                    onChange={(e, value) => changeSettings('algorithm', value as TAlgoritm)}
                >
                    <FormControlLabel value={'dfs'} control={<Radio />} label="Пошук вглиб" />
                    <FormControlLabel value={'bfs'} control={<Radio />} label="Пошук вшир" />
                    <FormControlLabel value={'uls'} control={<Radio />} label="Однонаправлений хвильовий пошук" />
                    <FormControlLabel value={'bls'} control={<Radio />} label="Двонаправлений хвильовий пошук" />
                    <FormControlLabel value={'dijkstra'} control={<Radio />} label="Алгоритм Дейкстри" />

                </RadioGroup>
            </FormControl>
            <Box sx={{ marginBlock: '5px' }}>
                <FormControlLabel control={<Switch value={settings.visualisation} onChange={(e, checked) => changeSettings('visualisation', checked)} />} label="Візуалізація пошуку" />
            </Box>
            <Box width='100%' display='flex' justifyContent='center' mb='10px'>
                <Button disabled={settings.source === null || settings.target === null} onClick={search}>Виконати</Button>
            </Box>
            {path.nodes &&
                <>
                    <Typography variant='h6' mt={2} mb={1}>
                        Найкоротший шлях
                    </Typography>
                    <Typography variant='body1' marginBlock={1} sx={{ color: theme.palette.text.secondary }}>
                        {path.nodes}
                    </Typography>
                    {path.weight &&
                        <Typography variant='body1' marginBlock={1} sx={{ color: theme.palette.text.secondary }}>
                            {'Довжина: ' + path.weight + ' км.'}
                        </Typography>
                    }

                    <Typography variant='body1' marginBlock={1} sx={{ color: theme.palette.text.secondary }}>
                        {'Час виконання: ' + path.time + ' мс.'}
                    </Typography>
                </>
            }
        </>
    )
}
