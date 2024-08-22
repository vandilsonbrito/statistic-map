'use client'
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { covidCasesDataFetched, casesData, latestDay} from "@/utils/stores/atoms";
import Chart from "react-apexcharts";
import { Serie } from "@/utils/types/types";

function CasesChart() {

    const [covidData] = useAtom(covidCasesDataFetched);
    const [covidCases] = useAtom(casesData);
    const [lastApiUpdateDay] = useAtom(latestDay);
    const [dates, setDates] = useState<string[]>([]);
    const [casesMonthly, setCasesMonthly] = useState<number[]>([]);
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState<Serie[]>([]);

    useEffect(() => {
        console.log("COVIDCASES", covidCases)

        //setDates(Object.keys(covidCases).map((item) => item))
        //setCasesMonthly(Object.values(covidCases).map((item) => Number(item.total)));
        const setDataForChart = () => {
            let arrAux1 = [], arrAux2 = [];
            for(const key in covidCases) {
                const casesDate = new Date(key)
                const nextDate = new Date(casesDate.getTime() + 86400000);
                const nextDateString = nextDate.toISOString().slice(0, 10);
                
                // Pegar valor total quando virar o mês e colocar no array
                if(key.at(6) !== nextDateString.at(6)) {
                    //console.log(`Data: ${key}`);
                    //console.log("CovidCasesTotal", covidCases[key]?.total);
                    arrAux1.push(key);
                    arrAux2.push(Number(covidCases[key].total));

                }
            }
            //Adding last month of api update | 2023-03-09
            arrAux1.push(lastApiUpdateDay);
            arrAux2.push(Number(covidCases[lastApiUpdateDay]?.total));

            setDates(arrAux1);
            setCasesMonthly(arrAux2)
        }
        setDataForChart()

    }, [covidCases, lastApiUpdateDay])

    const formatNumber = (value: number) => {
        if (value >= 100000) {
          return `${(value / 100000).toFixed(0)}k`;
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
                            <p className="">Number of Cases</p> 
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

export default CasesChart
