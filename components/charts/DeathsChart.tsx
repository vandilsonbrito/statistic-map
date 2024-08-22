'use client'
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { covidDeathsDataFetched, latestDay} from "@/utils/stores/atoms";
import Chart from "react-apexcharts";
import { CaseData, Cases, Serie } from "@/utils/types/types";

function DeathsChart() {

    const [covidDeathsData] = useAtom(covidDeathsDataFetched);
    const [covidDeaths, setCovidDeaths] = useState<Cases>({});
    const [lastApiUpdateDay] = useAtom(latestDay);
    const [dates, setDates] = useState<string[]>([]);
    const [casesMonthly, setCasesMonthly] = useState<number[]>([]);
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState<Serie[]>([]);

    useEffect(() => {
        if(covidDeathsData) {
            const auxVar: Cases = {};

            covidDeathsData.forEach((item) => {
                for (const date in item.deaths) {
                  // Acessa os dados de mortes para cada data
                  auxVar[date] = {
                    new: item.deaths[date].new,
                    total: item.deaths[date].total,
                  };
                }
              });
            setCovidDeaths(auxVar);
        }
        
    }, [covidDeathsData])

    useEffect(() => {
        console.log("covidDeathsSSSSSSS", covidDeaths)
    
        const setDataForChart = () => {
            if(covidDeaths) {
                let arrAux1 = [], arrAux2 = [];
                for(const key in covidDeaths) {

                    const casesDate = new Date(key)
                    const nextDate = new Date(casesDate.getTime() + 86400000);
                    const nextDateString = nextDate.toISOString().slice(0, 10);
                    
                    // Pegar valor total quando virar o mês e colocar no array
                    if(key.at(6) !== nextDateString.at(6)) {
                        console.log(`Data: ${key}`);
                        console.log("CovidDeathsTotal", covidDeaths[key]?.total);
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
        if (value >= 10000) {
          return `${(value / 10000).toFixed(0)}k`;
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
        <div className="w-[600px] flex justify-center items-center shadow-xl rounded-md bg-white">
            <div>
                {
                    (dates && casesMonthly) &&
                    (
                        <div className="w-full h-full flex flex-col justify-center items-center pt-3">
                            <p className="">Number of Deaths</p>
                            <Chart
                                options={options}
                                series={series}
                                type="line"
                                width="550"
                            />
                        </div>
                    )
                }
            </div>
        </div>
      );
}

export default DeathsChart
