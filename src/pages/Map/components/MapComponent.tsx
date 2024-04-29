import React from 'react'
import { Box, PopoverPosition } from '@mui/material';
import { MapContainer, Marker, GeoJSON, Tooltip, } from 'react-leaflet';
import { GeoJsonObject, LineString, MultiLineString } from 'geojson';

import ukraineJson from '../../../data/ukraine.json'

import { createIcon } from '../Icon/Icon'

import { useTheme } from '@mui/material/styles';
import { useGraph } from '../../../context/Graph';
import 'leaflet/dist/leaflet.css';
import '../style.css'
import { ILine, INode } from '../../../data/interfaces';
import MarkerMenu from './MarkerMenu';
import PolylineMenu from './PolylineMenu';
import L from 'leaflet';

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
    const { nodes, lines, getNodesFromLine } = useGraph();
    const mapInstance = React.useRef<L.Map | null>(null);
    const polylinesRef = React.useRef<L.Polyline[]>([]);
    const [mapLoaded, setMapLoaded] = React.useState(false);
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
    const addPolylines = () => {
        if (mapInstance.current) {
            for (let polyline of polylinesRef.current) {
                mapInstance.current.removeLayer(polyline);
            }
            polylinesRef.current = [];
            for (let line of lines) {
                const { source, target } = getNodesFromLine(line);
                if (source && target) {
                    let polyline: L.Polyline<LineString | MultiLineString, any>;
                    polyline = L.polyline([[source.lat, source.lng], [target.lat, target.lng]], {
                        color: line.color ? line.color : theme.palette.text.secondary,
                        weight: line.color ? 5 : 3,
                        dashArray: '5, 5',
                    }).addTo(mapInstance.current);
                    polyline.on('click', (event) => handlePolylineClick(event, line));

                    polyline.bindTooltip(source.name + ' - ' + target.name + ' ' + line.weight + ' км.');
                    polylinesRef.current = [...polylinesRef.current, polyline];
                }
            }
        }
    }

    React.useEffect(() => {
        addPolylines();
        // eslint-disable-next-line
    }, [lines, nodes]);

    React.useEffect(() => {
        setTimeout(() => {
            addPolylines();
        }, 200);
        // eslint-disable-next-line
    }, [mapLoaded]);

    return (
        <Box height='calc(100vh - 84.5px)' minHeight='calc(100% - 16px)'>
            <MapContainer ref={mapInstance} whenReady={() => setMapLoaded(true)} center={[49.0, 31.0]} zoom={5.5} style={{ width: '100%', height: '100%', background: theme.palette.secondary.main }} zoomControl={false} attributionControl={false}>
                <GeoJSON data={ukraineJson as GeoJsonObject} />
                {nodes.map(point => (

                    <Marker key={point.id} position={[point.lat, point.lng]} icon={createIcon(point.color ? point.color : theme.palette.text.secondary)} eventHandlers={{ click: (event) => handleMarkerClick(event, point) }}>
                        <Tooltip permanent>
                            {point.shortName}
                        </Tooltip>
                    </Marker>
                ))}
                {/* {lines.map((line, index) => {
                    const { source, target } = getNodesFromLine(line);

                    if (source && target) {
                        return (
                            <div key={line.id * (new Date).getMilliseconds()}>
                                <Polyline
                                    eventHandlers={{ click: (event) => handlePolylineClick(event, line) }}
                                    positions={[[source.lat, source.lng], [target.lat, target.lng]]}
                                    color={line.selected ? theme.palette.primary.main : theme.palette.secondary.main} weight={line.selected ? 5 : 3} dashArray={[5, 5]}
                                >
                                    <Tooltip>
                                        {source.name + ' - ' + target.name + ' ' + line.weight + ' км.'}
                                    </Tooltip>
                                </Polyline>
                            </div>
                        );
                    }
                    return null;
                })} */}
            </MapContainer>

            <MarkerMenu
                onClose={() => setNodeMenu({ node: nodeMenu.node })}
                anchorPosition={nodeMenu.position}
                node={nodeMenu.node}
            />

            <PolylineMenu
                onClose={() => setLineMenu({ line: lineMenu.line })}
                anchorPosition={lineMenu.position}
                line={lineMenu.line}
            />

        </Box>
    )
}
