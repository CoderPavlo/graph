import L from 'leaflet';

export function createIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><circle cx="7.5" cy="7.5" r="7.5" fill="${color}" /></svg>`;
  const icon = `data:image/svg+xml;base64,${btoa(svg)}`;

  return new L.Icon({
    iconUrl: icon,
    iconRetinaUrl: icon,
    iconSize: new L.Point(15, 15),
  });
}