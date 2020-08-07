import React, {useState, useEffect} from 'react';
import { Line } from "react-chartjs-2";
import numeral from 'numeral';


const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius:0,
        },
    },
    maintainAspectRatio: false,
    tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [{
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display:false,
                },
                ticks: {
                    //include a dollar signs in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}

function LineGraph({casesType = "cases", ...props}) {
    const [data, setData] = useState({});

const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
   for(let date in data.cases) {
        if(lastDataPoint){
            // get the date difference
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }


    return chartData;
}

useEffect(() => {
    const fetchData = async () => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then(response => response.json())
        .then(data => {
            const chartData = buildChartData(data, casesType);
            setData(chartData);
            // console.log(chartData);

        })
    };
    fetchData();
    },[casesType]);

    return (
        <div className = {props.className}> 
            {/* check if there is data */}
            {data?.length > 0 && (
                <Line className = "linegraph"
                options={options}
                data= {{
                datasets: [
                    {
                    backgroundColor: "rgba(204, 16 , 52, 0.5)",
                    borderColor: "#CC1034",
                    data: data,
                    }
                ]
            }}
            />


            )}
            
        </div>
    )
}

export default LineGraph
