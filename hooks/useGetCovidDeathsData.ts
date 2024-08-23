import { useQuery } from "@tanstack/react-query";
import { countryName } from "@/utils/stores/atoms";
import { useAtom } from "jotai";

export function useGetCovidDeathsData() {
    const API_NINJAS_KEY = process.env.NEXT_PUBLIC_API_NINJAS_KEY as string;

    const [countryNm] = useAtom(countryName);

    const fetchCovidData = async () => {
        try {
            const response = await fetch(`https://api.api-ninjas.com/v1/covid19?country=${countryNm}&type=deaths`, {
                headers: {
                    "X-Api-Key": API_NINJAS_KEY,
                }
            });
            const data = await response.json();
            return data
        }
        catch(error) {
            console.error("Error fetching deaths Covid data", error)
        } 
    }

    const query = useQuery({
        queryFn: fetchCovidData,
        queryKey: ['deaths-covid-data', countryNm],
        enabled: !!countryNm
    })
    return query
}