'use client';
import { useGetCovidCasesData } from "@/hooks/useGetCovidCasesData";
import { isMapClickedAtom, countryName, covidCasesDataFetched, covidDeathsDataFetched, latestDay, dataLatestDay, casesData, isFetchingCasesDataAtom, isFetchingDeathsDataAtom } from "@/utils/stores/atoms";
import { useAtom } from "jotai";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { CaseData, Cases } from "@/utils/types/types";
import { useGetCovidDeathsData } from "@/hooks/useGetCovidDeathsData";

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
  const [selectedCountry] = useAtom(countryName);
  const [isFetchingCasesData, setIsFetchingCasesData] = useAtom(isFetchingCasesDataAtom);
  const [isFetchingDeathsData, setIsFetchingDeathsData] = useAtom(isFetchingDeathsDataAtom);
  const [covidCasesData, setCovidCasesData] = useAtom(covidCasesDataFetched);
  const [CovidDeathsData, setCovidDeathsData] = useAtom(covidDeathsDataFetched);
  const [covidCases, setCovidCases] = useAtom(casesData);
  const [lastApiUpdateDay, setLastApiUpdateDay] = useAtom(latestDay);
  const [latestTotalApiData, setLatestTotalApiData] = useAtom(dataLatestDay);
  const [countryPercentage, setCountryPercentage] = useState<string>('');


  const { data:CovidCasesDataHook, refetch:refetchCovidCasesData, isFetching: isFetchingCasesDataHook } = useGetCovidCasesData();
  useEffect(() => {
    if(CovidCasesDataHook){
      setCovidCasesData(CovidCasesDataHook);
    }
  }, [CovidCasesDataHook, setCovidCasesData])

  const { data:CovidDeathsDataHook, refetch:refetchCovidDeathsData, isFetching: isFetchingDeathsDataHook } = useGetCovidDeathsData();
  useEffect(() => {
    setCovidDeathsData(CovidDeathsDataHook)
  }, [CovidDeathsDataHook, setCovidDeathsData])

  useEffect(()=> {
    if(isFetchingCasesDataHook) {
      setIsFetchingCasesData(true);
    }
    if(isFetchingDeathsDataHook) {
      setIsFetchingDeathsData(true);
    }
    else {
      setIsFetchingCasesData(false);
      setIsFetchingDeathsData(false);
    }
  }, [isFetchingCasesDataHook, isFetchingDeathsDataHook, setIsFetchingCasesData, setIsFetchingDeathsData])

  useEffect(() => {
    if(covidCasesData) {
      let latestDay: string;
      let arr = [];
      for(const key in covidCasesData) {
        for(const key2 in covidCasesData[key].cases) {
          arr.push(key2)
        }
      }
      latestDay = arr.pop() as string;
      setLastApiUpdateDay(latestDay);
    }
  }, [covidCasesData, setLastApiUpdateDay])

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

      let total: string = cases.reduce((acc: number, item) => acc + parseInt(item.total), 0).toString(); 
      setLatestTotalApiData(total);

      /* console.log("Cases", cases);
      console.log(total); */
    }
  }, [covidCasesData, lastApiUpdateDay, setCovidCases, setLatestTotalApiData])

  useEffect(() => {
    if(mapClicked) {
      refetchCovidCasesData();
      refetchCovidDeathsData();
      setMapClicked(false);
    }
  }, [mapClicked, refetchCovidCasesData, refetchCovidDeathsData])

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
    <main className="flex min-h-screen flex-col items-center px-4 sm:px-8 lg:px-16 py-5 bg-[#f5f5f2]">
        <h1 className="text-2xl pt-2 pb-5 font-medium">Dashboard COVID-19</h1>
        <div className="w-full max-w-[1500px] h-full rounded-lg">
            <DynamicMap/>
            <h2 className="font-semibold text-lg text-center pt-5">Infected People</h2>
            <div className="w-full h-full flex flex-col gap-3 lg:flex-row lg:justify-around items-center pt-1 pb-3">
              
              <div className='w-[18rem] h-[11rem] shadow-xl flex flex-col justify-center items-center gap-5 rounded-md lg:my-6 bg-white'>
                <h2 className='text-lg pt-6 text-center'>Global</h2>
                <div className="w-[18rem] h-[7rem]  flex flex-col items-center gap-5">
                  {
                    isFetchingCasesDataHook ? (
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
              <div className='w-[18rem] h-[11rem] shadow-xl flex flex-col justify-center items-center gap-5 rounded-md lg:my-6 bg-white'>
                <h2 className='text-lg pt-6 text-center'>{latestTotalApiData ? selectedCountry : "País"}</h2>
                <div className="w-[18rem] h-[7rem]  flex flex-col items-center gap-5">
                  {
                    isFetchingCasesDataHook ? (
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
              <div className='w-[18rem] h-[11rem] shadow-xl flex flex-col justify-center items-center gap-5 rounded-md lg:my-6 bg-white'>
                <h2 className='text-lg pt-6 text-center'>{latestTotalApiData ? selectedCountry : "País"}</h2>
                <div className="w-[18rem] h-[7rem]  flex flex-col items-center gap-5">
                  {
                    isFetchingCasesDataHook ? (
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
        <div className="w-full h-full flex flex-col justify-center items-center py-7">
          <h2 className="text-lg pt-6 text-center font-semibold pb-10">Data Timeline</h2>
          <div className="w-full max-w-[1500px] flex flex-col xl:flex-row justify-center items-center gap-10">
            <CasesChart/>
            <DeathsChart/>
          </div>
        </div>
        <footer className="pt-3 pb-2">
            <p className="text-sm md:text-base">Developed by <a target="_blank" className="underline" href="https://vandilson-portfolio.vercel.app/">Vandilson Brito</a></p>
        </footer>
    </main>
  );
}
