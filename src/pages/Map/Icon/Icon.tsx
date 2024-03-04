import L from 'leaflet';
import marker from './marker.svg'
import markerSelected from './markerSelected.svg'
export const icon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    iconSize: new L.Point(15, 15),
  });

  export const iconSelected = new L.Icon({
    iconUrl: markerSelected,
    iconRetinaUrl: markerSelected,
    iconSize: new L.Point(15, 15),
  });