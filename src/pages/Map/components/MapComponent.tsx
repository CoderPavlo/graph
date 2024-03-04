import React from 'react'
import { Box, PopoverPosition } from '@mui/material';
import { MapContainer, Marker, Polyline, GeoJSON, Tooltip } from 'react-leaflet';
import { GeoJsonObject } from 'geojson';

import ukraineJson from '../../../data/ukraine.json'

import { icon, iconSelected } from '../Icon/Icon'

import { useTheme } from '@mui/material/styles';
import { useGraph } from '../../../context/Graph';
import 'leaflet/dist/leaflet.css';
import '../style.css'
import { ILine, INode } from '../../../data/interfaces';
import MarkerMenu from './MarkerMenu';
import PolylineMenu from './PolylineMenu';

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
        <Box height='calc(100vh - 84.5px)' minHeight='calc(100% - 16px)'>
            <MapContainer center={[49.0, 31.0]} zoom={5.5} style={{ width: '100%', height: '100%', background: theme.palette.secondary.main }} zoomControl={false} attributionControl={false}>
                <GeoJSON data={ukraineJson as GeoJsonObject} />
                {nodes.map(point => (

                    <Marker key={point.id} position={[point.lat, point.lng]} icon={point.selected ? iconSelected : icon} eventHandlers={{ click: (event) => handleMarkerClick(event, point) }}>
                        <Tooltip permanent>
                            {point.shortName}
                        </Tooltip>
                    </Marker>
                ))}
                {lines.map((line, index) => (


                    <Polyline key={index}
                        eventHandlers={{ click: (event) => handlePolylineClick(event, line) }}
                        positions={[[line.source.lat, line.source.lng], [line.target.lat, line.target.lng]]}
                        color={line.selected ? theme.palette.primary.main : theme.palette.secondary.main} weight={3} dashArray={[5, 5]}>
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
    )
}
