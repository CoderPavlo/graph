import React from 'react'
import { Box, Grid, PopoverPosition } from '@mui/material';
import { Outlet } from 'react-router';
import { MapContainer, Marker, Polyline, GeoJSON, Tooltip } from 'react-leaflet';
import { GeoJsonObject } from 'geojson';

import ukraineJson from '../../data/ukraine.json'

import NavBar from './components/NavBar';
import { icon } from './components/Icon'

import { useTheme } from '@mui/material/styles';
import { useGraph } from '../../context/Graph';
import 'leaflet/dist/leaflet.css';
import { ILine, INode } from '../../data/interfaces';
import MarkerMenu from './components/MarkerMenu';
import PolylineMenu from './components/PolylineMenu';

interface INodeMenu {
    position?: PopoverPosition,
    node?: INode,
}

interface ILineMenu {
    position?: PopoverPosition,
    line?: ILine,
}

export default function Map() {
    const theme = useTheme();
    const { nodes, lines } = useGraph();

    const [nodeMenu, setNodeMenu] = React.useState<INodeMenu>({});

    const handleMarkerClick = (event: L.LeafletMouseEvent, point: INode) => {
        const { originalEvent } = event;
        const { clientX, clientY } = originalEvent;
        setNodeMenu({
            node: point,
            position: { left: clientX, top: clientY },
        });
    };

    const [lineMenu, setLineMenu] = React.useState<ILineMenu>({});

    const handlePolylineClick = (event: L.LeafletMouseEvent, line: ILine) => {
        const { originalEvent } = event;
        const { clientX, clientY } = originalEvent;
        setLineMenu({
            line: line,
            position: { left: clientX, top: clientY },
        });
    };

    return (
        <Box style={{ width: '100%', height: '100vh', background: theme.palette.background.default}}>
            <NavBar />
            <Grid container spacing={0} mt={0}>
                <Grid item xs={12} md={9} xl={7} padding={1}>
                    <Box height='calc(100vh - 80px)' minHeight='100%'> 
                        <MapContainer center={[49.0, 31.0]} zoom={5.5} style={{ width: '100%', height: '100%', background: theme.palette.secondary.main }} zoomControl={false} attributionControl={false}>
                            <GeoJSON data={ukraineJson as GeoJsonObject} />
                            {nodes.map(point => (

                                <Marker key={point.id} position={[point.lat, point.lng]} icon={icon} eventHandlers={{ click: (event) => handleMarkerClick(event, point) }}>
                                    <Tooltip>
                                        {point.name}
                                    </Tooltip>
                                </Marker>
                            ))}
                            {lines.map((line, index) => (


                                <Polyline key={index}
                                    eventHandlers={{ click: (event) => handlePolylineClick(event, line) }}
                                    positions={[[line.source.lat, line.source.lng], [line.target.lat, line.target.lng]]}
                                    color={theme.palette.primary.main} weight={3}>
                                    <Tooltip>
                                        {line.source.name + ' - ' + line.target.name + ' ' + line.weight + ' км.'}
                                    </Tooltip>
                                </Polyline>
                            ))}
                        </MapContainer>

                        <MarkerMenu
                            onClose={() => setNodeMenu({})}
                            anchorPosition={nodeMenu.position}
                            node={nodeMenu.node}
                        />

                        <PolylineMenu
                            onClose={() => setLineMenu({})}
                            anchorPosition={lineMenu.position}
                            line={lineMenu.line}
                        />

                    </Box>
                </Grid>
                <Grid item xs={12} md={3} xl={5} padding={1} sx={{height: {md: '658.7px'}}} overflow='scroll'>
                    <Outlet />
                </Grid>
            </Grid>
        </Box>
    )
}
