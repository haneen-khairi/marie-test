import Chart from "react-apexcharts";
import React from "react";

const AreaChart = React.memo(({ data }: { data: any }) => {
 

  
      function transformData(inputData: any) {
      const categories: any[] = [];
      const series: any[] = [];
  
      // Assuming the years are the same for all types, we can use the first type to get the years
      inputData[0]?.stats?.forEach((stat: any) => {
          categories.push(stat.year);
      });
      
      // Process each type of incident
      inputData?.forEach((type: any) => {
          const seriesData = type.stats.map((stat: any) => {
            if(stat.stats !== undefined){
              return stat.stats
            }else{
              return stat.incidents_count
            }
          });
          series.push({ name: type.type, data: seriesData });
      });
  
      return {
          options: { xaxis: { categories } },
          series
      };
  }
  
  
  
  // Transforming the data
  const transformedData = transformData(data);
  // setDataChart(example)
  
  return (
    <Chart
      options={transformedData.options}
      series={transformedData.series}
      type="area"
      width="100%"
    />
  );
});

export default AreaChart;
