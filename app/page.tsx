'use client';
import { useGetCovidData } from "@/hooks/useGetCovidData";
import { isMapClickedAtom, countryName, covidDataFetched, latestDay, dataLatestDay, casesData } from "@/utils/stores/atoms";
import { useAtom } from "jotai";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { CaseData, DataFetched } from "@/utils/types/types";
import Chart1 from "@/components/chart/Chart";

const DynamicMap = dynamic(() => import('../components/map/Map'), {
  ssr: false
});
const CasesChart = dynamic(() => import('../components/charts/CasesChart'), {
  ssr: false
});
const DeathsChart = dynamic(() => import('../components/charts/DeathsChart'), {
  ssr: false
});

export default function Home() {

  const [mapClicked, setMapClicked] = useAtom(isMapClickedAtom);
  const [selectedCountry, setSelectedCountry] = useAtom(countryName);
  const [covidData, setCovidData] = useAtom(covidDataFetched);
  const [covidCases, setCovidCases] = useAtom(casesData);
  const [lastApiUpdateDay, setLastApiUpdateDay] = useAtom(latestDay);
  const [latestTotalApiData, setLatestTotalApiData] = useAtom(dataLatestDay);
  const [countryPercentage, setCountryPercentage] = useState<string>('');

  useEffect(() => {
    }
  }, [geoData, setSelectedCountry])

  const { data:CovidDataHook, refetch:refetchCovidData, isFetching } = useGetCovidData();
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
    if(covidCasesData){
      let casesRegions: Cases[] = [];
      let cases: CaseData[] = Object.keys(covidCasesData).reduce((acc: CaseData[], key: string) => {
        const caseData = covidCasesData[parseInt(key)]?.cases; // Acessa os casos do objeto
        
        casesRegions.push(caseData);
        if(caseData) {
          Object.keys(caseData).forEach(date => {
            if(date === lastApiUpdateDay) {
              acc.push(caseData[date]); // Adiciona o total de casos do útlinmo dia do mês ao acumulador
            }
          });
        }
        return acc; // Retorna o acumulador
      }, []);
      setCovidCases(casesRegions);

      setLatestTotalApiData(total);

      console.log("Cases", cases);
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

  useEffect(() => {
    if(latestTotalApiData) {
      setCountryPercentage(((parseInt(latestTotalApiData) * 100) / 704753890).toFixed(2).toString());
    }
  }, [latestTotalApiData])

  const formatData = (data: string) => {
    let arrAux1: string[] = []; const arrAux2: string[] = []; let indexAux = 1; 
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
            <h2 className="font-semibold text-lg text-center pt-5">Infected People</h2>
            <div className="w-full h-full flex justify-around">
              <div className='w-[18rem] h-[11rem] shadow-xl flex flex-col justify-center items-center gap-5 rounded-md my-6'>
                <h2 className='text-lg pt-6 text-center'>Global</h2>
                <div className="w-[18rem] h-[7rem]  flex flex-col items-center gap-5">
                  {
                    isFetching ? (
                        <span className="loader"></span>
                    ) : (
                      <>
                        <p className='text-2xl'>704.753.890</p>
                        <p className='text-[0.65rem] font-medium'>*Last Update 2023-03</p>
                      </>
                  )
                  }
                </div>
              </div>
              <div className='w-[18rem] h-[11rem] shadow-xl flex flex-col justify-center items-center gap-5 rounded-md my-6'>
                <h2 className='text-lg pt-6 text-center'>{latestTotalApiData ? selectedCountry : "País"}</h2>
                <div className="w-[18rem] h-[7rem]  flex flex-col items-center gap-5">
                  {
                    isFetching ? (
                        <span className="loader"></span>
                    ) : (
                      <>
                      <p className='text-2xl'>{formatData(latestTotalApiData)}</p>
                      <p className='text-[0.65rem] font-medium'>*Last Update {lastApiUpdateDay}</p>
                      </>
                    )
                  }
                </div>
              </div>
              <div className='w-[18rem] h-[11rem] shadow-xl flex flex-col justify-center items-center gap-5 rounded-md my-6'>
                <h2 className='text-lg pt-6 text-center'>{latestTotalApiData ? selectedCountry : "País"}</h2>
                <div className="w-[18rem] h-[7rem]  flex flex-col items-center gap-5">
                  {
                    isFetching ? (
                      <span className="loader"></span>
                    ) : (
                      <>
                        <p className='text-2xl'>{`${countryPercentage}%`}</p>
                        <p className='text-[0.65rem] font-medium'>Percentage of Global Cases</p>
                      </>
                    )
                  }
                </div>
              </div>
              
            </div>
        </div>
        <div className="w-full h-full py-7">
          <h2 className="text-lg pt-6 text-center font-semibold pb-10">Data Timeline</h2>
          <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-10">
            <CasesChart/>
            <DeathsChart/>
          </div>
        </div>
    </main>
  );
}
