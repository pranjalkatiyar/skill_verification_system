import React, { useState,useEffect } from "react";
import { Line } from "react-chartjs-2";

const LineChart = (props)=> {
   const [data, setData] = useState({});
  const [options, setOptions] = useState({});
  const [newdata, setNewdata] = useState({});

 useEffect( () => {
    setTimeout(() => {
      var data = {
        labels: [...Array(props.overallEndorsement?.length).keys()],
        datasets: [
          {
            label: "Endorse Rating Spread",
            data:  props.overallEndorsement,
            fill: false,
            backgroundColor: "white",
            borderColor: "rgba(255,255,255,0.3)",
          },
        ],
      };

      var options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };
      setData(data);
      setOptions(options);
    }, 1000);
  },[]);
     return <Line data={ data} options={ options} />;
  }
 
export default LineChart;