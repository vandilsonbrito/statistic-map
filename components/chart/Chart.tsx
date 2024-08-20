'use client'
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { covidDataFetched, casesData, latestDay} from "@/utils/stores/atoms";
import Chart from "react-apexcharts";
import { Serie } from "@/utils/types/types";

function Chart1() {

    const [covidData] = useAtom(covidDataFetched);
    const [covidCases] = useAtom(casesData);
    const [lastApiUpdateDay] = useAtom(latestDay);
    const [dates, setDates] = useState<string[]>([]);
    const [casesMonthly, setCasesMonthly] = useState<number[]>([]);
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState<Serie[]>([]);

    useEffect(() => {

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
                    console.log(`Data: ${key}`);
                    console.log("CovidCasesTotal", covidCases[key]?.total);
                    arrAux1.push(key);
                    arrAux2.push(Number(covidCases[key].total));

                    console.log("Mudou de mês")
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

    useEffect(() => {
        setOptions({
            chart: {
              id: "basic-bar"
            },  
            xaxis: {
              categories: dates
            }
          });
        
          setSeries([
            {
              name: "series-1",
              data: casesMonthly
            }
          ]);

          console.log("Dates", dates);
          console.log("CasesMonthly", casesMonthly);
    }, [casesMonthly, dates])

    
    
      return (
        <div className="w-[700px] flex justify-center items-center shadow-xl rounded-md">
            <div>
                {
                    (dates && casesMonthly) &&
                    (
                        <div className="w-full h-full flex relative">
                            <div className="w-[150px] flex flex-col-reverse justify-center absolute top-32 -left-20 ">
                                <p className="-rotate-90">Number of Cases</p>
                            </div>
                            <Chart
                                options={options}
                                series={series}
                                type="line"
                                width="600"
                            />
                        </div>
                    )
                }
            </div>
        </div>
      );
}

export default Chart1
