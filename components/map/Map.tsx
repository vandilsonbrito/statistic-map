'use client'
import { MapContainer, TileLayer, useMapEvents, GeoJSON} from 'react-leaflet';
import { useAtom } from 'jotai';
import { latAtom, lngAtom, isMapClickedAtom, countryName } from '@/utils/stores/atoms';
import 'leaflet/dist/leaflet.css'; 
import { useEffect, useState } from 'react';
import { GeoJSONFeature, FeatureProperties } from '../../utils/types/types';
import { Layer, PathOptions } from 'leaflet';
import { FiSearch } from "react-icons/fi";


function Map() {
    const [lat, setLat] = useAtom(latAtom);
    const [lng, setLng] = useAtom(lngAtom);
    const [mapClicked, setMapClicked] = useAtom(isMapClickedAtom);
    const [geojsonData, setGeojsonData] = useState<any>(null);
    const [selectedCountry, setSelectedCountry] = useAtom(countryName);

    useEffect(() => {
        const fetchGeojson = async () => {
            const response = await fetch('/globe.geo.json');
            const data = await response.json();
            
            setGeojsonData(data);
        }
        fetchGeojson();

    }, [])

    const onEachFeature = (feature: GeoJSONFeature, layer: Layer) => {
        if (feature.properties && feature.properties.name) {
            layer.bindTooltip(feature.properties.name, {
                permanent: false, // O tooltip aparece apenas quando o usuário passa o mouse
                direction: 'auto',
            });
        }

        layer.on({
          click: () => {
            setSelectedCountry(feature.properties.name);
          }
        });
      };
      
    const style = (feature?: GeoJSONFeature): PathOptions => {
        if (!feature) {
            return {};
        }
        return {
          fillColor: feature.properties.name === selectedCountry ? 'blue' : 'transparent',
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        };
    };

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
        <div className="relative">
            <p className='absolute top-3 right-2 z-10 bg-[#aad3df] text-white font-semibold rounded-md p-2 text-xs sm:text-sm'>Click on the country to see the data</p>
            <MapContainer center={[21.505, -0.09]} zoom={2} scrollWheelZoom={true} className="w-full h-[350px] rounded-lg shadow-lg z-0">
                <MapEvents />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {geojsonData && (
                    <GeoJSON
                    data={geojsonData}
                    style={style}
                    onEachFeature={onEachFeature}
                    />
                )}
        </MapContainer>
    </div>
    );
}

export default Map;
