import React from 'react'
import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material'
import { useGraph } from '../../context/Graph';
import { INode, IShortestPath } from '../../data/interfaces';

import { useTheme } from '@mui/material/styles';

export interface ISearchSettings{
    source: INode | null,
    target: INode | null,
    visualisation: boolean,
}
export default function SearchPage() {
    const theme = useTheme();
    const { nodes, resetPath, dfs } = useGraph();

    const [path, setPath] = React.useState<IShortestPath>({});
    const [settings, setSettings] = React.useState<ISearchSettings>({source: null, target: null, visualisation: false});

    function changeSettings(key: 'source' | 'target' | 'visualisation', value: INode | boolean | null) {
        setPath({});
        resetPath();
        setSettings((prevValue) => {
            return {
                ...prevValue,
                [key]: value,
            };
        });
    }

    async function search(){
        setPath({});
        if (!settings.source || !settings.target) return;
        setPath(await dfs(settings.source, settings.target, settings.visualisation));
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
                    defaultValue={0}
                    name="radio-buttons-group"
                >
                    <FormControlLabel value={0} control={<Radio />} label="Пошук вглиб" />
                </RadioGroup>
            </FormControl>
            <Box sx={{marginBlock: '5px'}}>
            <FormControlLabel control={<Switch value={settings.visualisation} onChange={(e, checked)=>changeSettings('visualisation', checked)} />} label="Візуалізація пошуку" />
            </Box>
            <Box width='100%' display='flex' justifyContent='center' mb='10px'>
                <Button disabled={settings.source === null || settings.target === null} onClick={search}>Виконати</Button>
            </Box>
            {path.nodes &&
                <>
                    <Typography variant='h6' mt={2} mb={1}>
                        Найкоротший шлях
                    </Typography>
                    <Typography variant='body1' marginBlock={1} sx={{ color: theme.palette.text.secondary}}>
                        {path.nodes}
                    </Typography>
                    <Typography variant='body1' marginBlock={1} sx={{ color: theme.palette.text.secondary}}>
                        {'Довжина: ' + path.weight + ' км.'}
                    </Typography>
                    <Typography variant='body1' marginBlock={1} sx={{ color: theme.palette.text.secondary}}>
                        {'Час виконання: ' + path.time + ' мс.'}
                    </Typography>
                </>
            }
        </>
    )
}
