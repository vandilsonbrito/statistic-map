'use client'
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { covidDeathsDataFetched, isFetchingDeathsDataAtom, latestDay} from "@/utils/stores/atoms";
import Chart from "react-apexcharts";
import { CaseData, Cases, Serie } from "@/utils/types/types";
import useMedia from 'use-media';

function DeathsChart() {

    const [covidDeathsData] = useAtom(covidDeathsDataFetched);
    const [covidDeaths, setCovidDeaths] = useState<Cases>({});
    const [lastApiUpdateDay] = useAtom(latestDay);
    const [isFetchingDeathsData] = useAtom(isFetchingDeathsDataAtom);
    const [dates, setDates] = useState<string[]>([]);
    const [casesMonthly, setCasesMonthly] = useState<number[]>([]);
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState<Serie[]>([]);
    const isMobile = useMedia({ maxWidth: '719px' });

    useEffect(() => {
        if(Array.isArray(covidDeathsData)) {
            const arrCovidDeaths = covidDeathsData.map(item => item.deaths);
            let arrSummedValuesPerDates: number[] = [];
            const totalCovidDeathsPerDays: Cases = {};

            if(typeof arrCovidDeaths[0] === 'object') {

                const dates = Object.keys(arrCovidDeaths[0]).map(date => date);
                const arrValuesPerDates = dates.map(date => arrCovidDeaths.map(item => Number(item?.[date]?.total)));
                arrSummedValuesPerDates = arrValuesPerDates.map(item => item.reduce((acc, value) => acc + value, 0));
                //console.log("arrSummedValuesPerDates", arrSummedValuesPerDates)
    
                dates.forEach(date => {
                    totalCovidDeathsPerDays[date] = {new: '0', total: (arrSummedValuesPerDates[dates.indexOf(date)]).toString()};
                })
                  
                setCovidDeaths(totalCovidDeathsPerDays);
            }
        }
        

    }, [covidDeathsData])

    useEffect(() => {
        
    
        const setDataForChart = () => {
            if(covidDeaths) {
                let arrAux1 = [], arrAux2 = [];
                for(const key in covidDeaths) {

                    const casesDate = new Date(key)
                    const nextDate = new Date(casesDate.getTime() + 86400000);
                    const nextDateString = nextDate.toISOString().slice(0, 10);
                    
                    // Pegar valor total quando virar o mês e colocar no array
                    if(key.at(6) !== nextDateString.at(6)) {
                        /* console.log(`Data: ${key}`);
                        console.log("CovidDeathsTotal", covidDeaths[key]?.total); */
                        arrAux1.push(key);
                        arrAux2.push(Number(covidDeaths[key]?.total));

                    }    
                }
                //Adding last month of api update | 2023-03-09
                arrAux1.push(lastApiUpdateDay);
                arrAux2.push(Number(covidDeaths[lastApiUpdateDay]?.total));

                setDates(arrAux1);
                setCasesMonthly(arrAux2)
            }
        }
        setDataForChart()

    }, [covidDeaths, covidDeathsData, lastApiUpdateDay]);

    const formatNumber = (value: number) => {
        if(value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M'
        }
        else if (value >= 100000) {
          return `${(value / 1000).toFixed(0)}k`;
        }   
        else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}k`;
        }
        return value.toString(); 
    };

    useEffect(() => {
        setOptions({
            chart: {
              id: "basic-bar"
            },  
            xaxis: {
              categories: dates
            },
            yaxis: {
                labels: {
                  formatter: (value: number) => {
                    return formatNumber(value); 
                  },
                },
            }
          });
        
          setSeries([
            {
              name: "series-1",
              data: casesMonthly
            }
          ]);

 
    }, [casesMonthly, dates])

      return (
        <div className="w-[350px] md:w-[600px] flex justify-center items-center shadow-xl rounded-md bg-white">
            <div>
                <div className="w-full h-full min-h-[290px] md:min-h-[390px] flex flex-col justify-center items-center pt-3">
                    <p className="">Number of Deaths</p>
                    {
                        isFetchingDeathsData ? (
                                <div className={`${isMobile ? 'w-[350px]' : 'w-[550px]'} min-h-[290px] md:min-h-[300px] flex flex-col justify-center items-center`}>
                                    <span className="loader"></span>
                                </div>
                            ) 
                        : 
                            (
                                covidDeathsData?.length > 0 ?
                                (                      
                                    <Chart
                                        options={options}
                                        series={series}
                                        type="line"
                                        width={`${isMobile ? '350' : '550'}`}
                                    />   
                                ) : (
                                    <div className="h-[370px] flex justify-center items-center text-slate-600">
                                        <p>No data available</p>
                                    </div>
                                )
                            )
                    }
                    
                </div>
            </div>
        </div>
      );
}

export default DeathsChart
