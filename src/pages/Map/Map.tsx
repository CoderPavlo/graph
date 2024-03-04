import { Box, Grid, } from '@mui/material';
import { Outlet } from 'react-router';


import NavBar from './components/NavBar';

import { useTheme } from '@mui/material/styles';
import MapComponent from './components/MapComponent';

interface IMapProps {
    fullWidth?: boolean,
}

export default function Map({ fullWidth = false }: IMapProps) {
    const theme = useTheme();

    return (
        <Box style={{ width: '100%', height: '100vh', background: theme.palette.background.default }}>
            <NavBar />
            {fullWidth ?
                <Box padding={1}>
                    <MapComponent />
                </Box>
                :
                <Grid container spacing={0} mt={0}>
                    <Grid item xs={12} md={9} xl={7} padding={1}>
                        <MapComponent />
                    </Grid>
                    <Grid item xs={12} md={3} xl={5} padding={1} sx={{ height: { md: '658.7px' } }} overflow='scroll'>
                        <Outlet />
                    </Grid>
                </Grid>
            }
        </Box>
    )
}
