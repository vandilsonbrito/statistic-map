'use client'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useAtom } from 'jotai';
import { latAtom, lngAtom, isMapClickedAtom } from '@/utils/stores/atoms';
import 'leaflet/dist/leaflet.css'; 

function Map() {
    const [lat, setLat] = useAtom(latAtom);
    const [lng, setLng] = useAtom(lngAtom);
    const [mapClicked, setMapClicked] = useAtom(isMapClickedAtom);

    function MapEvents() {
        const map = useMapEvents({
            click: (e) => {
                setMapClicked(true);
                const { lat, lng } = e.latlng;
                setLat(lat.toString());
                setLng(lng.toString());
            }
        });
        return null;
    }

    return (
        <MapContainer center={[21.505, -0.09]} zoom={2} scrollWheelZoom={true} className="w-full h-[400px] rounded-lg shadow-lg">
            <MapEvents />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
}

export default Map;
