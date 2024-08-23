'use client'
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { covidCasesDataFetched, casesData, latestDay} from "@/utils/stores/atoms";
import Chart from "react-apexcharts";
import { Cases, Serie } from "@/utils/types/types";

function CasesChart() {

    /* const [covidData] = useAtom(covidCasesDataFetched); */
    const [covidCases] = useAtom(casesData);
    //const [totalCovidCasesPerDay, setTotalCovidCasesPerDay] = useAtom(casesData);
    const [lastApiUpdateDay] = useAtom(latestDay);
    const [dates, setDates] = useState<string[]>([]);
    const [casesMonthly, setCasesMonthly] = useState<number[]>([]);
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState<Serie[]>([]);

    useEffect(() => {
        let totalCovidCasesPerDays: Cases = {};
        let arrSummedValuesPerDates: number[] = [];
        //Compara se o primeiro elemento é um bojeto para passar pelo type e conseguir fazer o map do Object.keys
        if(typeof covidCases[0] === 'object') {
            //Código abaixo soma todos os casos totais das regiões (se existir mais de uma)
            const dates = Object.keys(covidCases?.[0]).map(date => date);
            const arrValuesPerDates = dates.map(date => covidCases.map(item => Number(item?.[date]?.total)));
            arrSummedValuesPerDates = arrValuesPerDates.map(item => item.reduce((acc, value) => acc + value, 0));

             //recria objeto Cases type: {'2022-02-22': {new: 0, total: item.value}}
            dates.forEach(date => {
                totalCovidCasesPerDays[date] = {new: '0', total: (arrSummedValuesPerDates[dates.indexOf(date)]).toString()};
            })
        }
        //console.log("TOTALcovidCASESperDAYS", totalCovidCasesPerDays);

        const setDataForChart = () => {
            let arrAux1 = [], arrAux2 = [];
            for(const key in totalCovidCasesPerDays) {
                const casesDate = new Date(key)
                const nextDate = new Date(casesDate.getTime() + 86400000);
                const nextDateString = nextDate.toISOString().slice(0, 10);
                
                // Pegar valor total quando virar o mês e colocar no array
                if(key.at(6) !== nextDateString.at(6)) {
                    //console.log(`Data: ${key}`);
                    //console.log("totalCovidCasesPerDaysTotal", totalCovidCasesPerDays[key]?.total);
                    arrAux1.push(key);
                    arrAux2.push(Number(totalCovidCasesPerDays[key].total));

                }
            }
            //Adding last month of api update | 2023-03-09
            arrAux1.push(lastApiUpdateDay);
            arrAux2.push(Number(totalCovidCasesPerDays[lastApiUpdateDay]?.total));

            setDates(arrAux1);
            setCasesMonthly(arrAux2)
        }
        setDataForChart()

    }, [covidCases, lastApiUpdateDay])

    const formatNumber = (value: number) => {
        if(value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M'
        }
        else if (value >= 100000) {
            return `${(value / 1000).toFixed(0)}k`;
          }
        else if (value < 100000) {
            return `${(value / 1000).toFixed(0)}k`;
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
            <div className="w-full h-full min-h-[390px] flex flex-col justify-center items-center pt-3">
                    <p className="">Number of Cases</p>
                    {
                        covidCases?.length > 0 ?
                        (                      
                            <Chart
                                options={options}
                                series={series}
                                type="line"
                                width="550"
                            />   
                        ) : (
                            <div className="h-[370px] flex justify-center items-center text-slate-600">
                                <p>No data available</p>
                            </div>
                        )
                    }
                    
                </div>
        </div>
      );
}

export default CasesChart
