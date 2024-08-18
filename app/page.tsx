'use client';
import StatisticInfoContainer from "@/components/statisticInfoContainer/StatisticInfoContainer";
import { useReverseGeocod } from "@/hooks/useReverseGeocod";
import { useGetCovidData } from "@/hooks/useGetCovidData";
import { latAtom, lngAtom, isMapClickedAtom, countryName, covidDataFetched, latestDay, dataLatestDay } from "@/utils/stores/atoms";
import { useAtom } from "jotai";
import dynamic from 'next/dynamic';
import { useEffect } from "react";
import { CaseData, DataFetched } from "@/utils/types/types";

const DynamicMap = dynamic(() => import('../components/map/Map'), {
    ssr: false
});

export default function Home() {

  const [mapClicked, setMapClicked] = useAtom(isMapClickedAtom);
  const [countryNm, setCountryNm] = useAtom(countryName);
  const [covidData, setCovidData] = useAtom(covidDataFetched);
  const [lastApiUpdateDay, setLastApiUpdateDay] = useAtom(latestDay);
  const [latestTotalApiData, setLatestTotalApiData] = useAtom(dataLatestDay);

  const { data:geoData, refetch:refetchGeoData } = useReverseGeocod();
  useEffect(() => {
    if(geoData) {
      console.log(geoData?.address?.country);
      setCountryNm(geoData?.address?.country)
    }
  }, [geoData, setCountryNm])

  const { data:CovidDataHook, refetch:refetchCovidData } = useGetCovidData();
  useEffect(() => {
    if(CovidDataHook){
      console.log(CovidDataHook);
      setCovidData(CovidDataHook);
    }
  }, [CovidDataHook, setCovidData])

  useEffect(() => {
    if(covidData) {
      let latestDay: string;
      let arr = [];
      for(const key in covidData) {
        for(const key2 in covidData[key].cases) {
          arr.push(key2)
        }
      }
      latestDay = arr.pop() as string;
      setLastApiUpdateDay(latestDay);
    }
  }, [covidData, setLastApiUpdateDay])

  useEffect(() => {
    if(covidData){
      let cases: CaseData[] = Object.keys(covidData).reduce((acc: CaseData[], key: string) => {
        const caseData = covidData[parseInt(key)]?.cases; // Acessa os casos do objeto
    
        if(caseData) {
          Object.keys(caseData).forEach(date => {
            if (date === lastApiUpdateDay) {
              acc.push(caseData[date]); // Adiciona os casos ao acumulador
            }
          });
        }
        return acc; // Retorna o acumulador
      }, []);

      const total: string = cases.reduce((acc: number, item) => acc + parseInt(item.total), 0).toString(); 
      setLatestTotalApiData(total);

      console.log(cases);
      console.log(total);
    }
  }, [covidData, lastApiUpdateDay, setLatestTotalApiData])

  useEffect(() => {
    if(mapClicked) {
      refetchGeoData();
      refetchCovidData();
      setMapClicked(false);
    }
  }, [mapClicked, refetchGeoData])

  const formatData = (data: string) => {
    let arrAux1: string[] = []; const arrAux2: string[] = []; let indexAux = 1; //[[10],[549],[876]]
    for(let i = (data.length - 1); i >= 0; i--) {
      arrAux1.push(data[i]);

      if(indexAux % 3 === 0) {
        let aux3 = arrAux1.reverse().join('');
        arrAux2.push(aux3);
        arrAux1 = [];
        indexAux = 0;
      }
      indexAux++;
    }
    if(arrAux1.length > 0){
      let aux3 = arrAux1.reverse().join('');
      arrAux2.push(aux3);
    }
    
    return arrAux2.reverse().join('.');
  }


  return (
    <main className="flex min-h-screen flex-col items-center px-16 py-5">
        <h1 className="text-2xl py-5">Dashboard COVID-19</h1>
        <div className="w-full h-full rounded-lg">
            <DynamicMap/>
            <p>{countryNm}</p>
            <div className="w-full h-full flex justify-around">
              <div className='w-[18rem] h-[12rem] shadow-xl flex flex-col justify-center items-center gap-5 rounded-md my-5'>
                <h2 className='text-lg'>Global</h2>
                {
                  latestTotalApiData ? (
                  <>
                      <p className='text-2xl'>775.867.547</p>
                      <p className='text-[0.6rem]'>*Última atualização 08/2024</p>
                  </>
                  ) : (<span className="loader"></span>)
                }
              </div>
              <div className='w-[18rem] h-[12rem] shadow-xl flex flex-col justify-center items-center gap-5 rounded-md my-5'>
                <h2 className='text-lg'>{latestTotalApiData ? countryNm : "País"}</h2>
                {
                  latestTotalApiData ? (
                  <>
                      <p className='text-2xl'>{formatData(latestTotalApiData)}</p>
                      <p className='text-[0.6rem]'>*Última atualização {lastApiUpdateDay}</p>
                  </>
                  ) : (<span className="loader"></span>)
                }
              </div>
              <div className='w-[18rem] h-[12rem] shadow-xl flex flex-col justify-center items-center gap-5 rounded-md my-5'>
                <h2 className='text-lg'>{latestTotalApiData ? countryNm : "País"}</h2>
                {
                  latestTotalApiData ? (
                  <>
                      <p className='text-2xl'>{latestTotalApiData}</p>
                      <p className='text-[0.6rem]'>*Última atualização {lastApiUpdateDay}</p>
                  </>
                  ) : (<span className="loader"></span>)
                }
              </div>
              
            </div>
        </div>

    </main>
  );
}
