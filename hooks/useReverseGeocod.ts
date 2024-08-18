import { useQuery } from "@tanstack/react-query";
import { latAtom, lngAtom } from "@/utils/stores/atoms";
import { useAtom } from "jotai";


export function useReverseGeocod() {

    const [lat] = useAtom(latAtom);
    const [lng] = useAtom(lngAtom);

    const fetchGeoCoding = async () => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lng}&accept-language=en&format=json`)
            const data = await response.json();
            return data;
        }
        catch(error) {
            console.error('Error fetching reverse geocoding!', error)
        }
        
    }
    
    const query = useQuery({
        queryFn: fetchGeoCoding,
        queryKey: ['reverse-geocoding'],
        enabled: !!lat && !!lng
    })
    return query;
    
}
