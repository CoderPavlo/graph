import L from 'leaflet';
import marker from './marker.svg'
export const icon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    iconSize: new L.Point(15, 15),
  });