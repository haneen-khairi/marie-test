import { GridItem, SimpleGrid, Text } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import * as StatsAPI from "../../../api/search/stats";
import CardComp from "../../../components/cards";
import TabsComp from "../../../components/tabs";
import BoxTitle from "../../../components/typography/BoxTitle";
import AreaChart from "./AreaChart";
// import SelectComponent from "../../../components/SelectComponent";
import InputTypePicker from "../../../components/forms/InputTypePicker";

const ResultsChartsBox = () => {
  const [stats, setStats] = useState({ fires: [
    {
      type: "",
      stats : []
    }
  ], crimes: [
    
      {
        type: "",
        stats : []
      }
    
  ] });
  // const [defaultValue, setDefaultValue] = useState<number>(0)
  const [chartSelectedOptions, setChartSelectedOptions] = useState({
    fires: [
      "Chimney fire",
      "Secondary Fire - accidental",
      "Secondary Fire - deliberate",
      "Primary fire - buildings"
    ],
    crimes: [
      "Criminal damage and arson",
      "Drugs",
      "Other crime",
      "theft",
      "Possession of weapons",
      "Public order",
      "Robbery",
      "Vehicle crime",
      "Violence and sexual offences"
    ],
  });
  // const crimesOptions = [
  //   {label: 'Criminal damage and arson', value:'Criminal damage and arson'} , 
  //   {label:'Drugs',value: 'Drugs'}, 
  //   {label: 'Other crime',  value: 'Other crime'} ,
  //   {label: 'theft',  value: 'theft'} ,
  //   {label: 'Possession of weapons',  value: 'Possession of weapons'} ,
  //   {label: 'Public order',  value: 'Public order'} ,
  //   {label: 'Robbery',  value: 'Robbery'} ,
  //   {label: 'Vehicle crime',  value: 'Vehicle crime'} ,
  //   {label: 'Violence and sexual offences' , value: 'Violence and sexual offences'} 
  // ]
  // const incidentsOptions = [
  //   {label: 'Chimney fire', value: 'Chimney fire'},
  //   {label: 'Secondary Fire - accidental', value: 'Secondary Fire - accidental'},
  //   {label: 'Secondary Fire - deliberate', value: 'Secondary Fire - deliberate'},
  //   {label: 'Primary fire - buildings', value: 'Primary fire - buildings'}
  // ]
  const { postcode } = useSelector(
    (_: { data: { postcode: string } }) => _.data
  );

  useEffect(() => {
    StatsAPI.crimes({
      postcode,
      start: "07-2020",
      count: 5,
      types: chartSelectedOptions.crimes,
    }).then((crimes: any) => {
      // @ts-ignore
      console.log('=== crimes ===',crimes)
      console.log('=== crimes includes ===', chartSelectedOptions.crimes.includes('type'))
      if(crimes[0].type === undefined){
        setStats((current) => ({ 
          ...current, 
          crimes: [
            {
              type: 'all' , 
              stats: crimes
            }
          ]
        }));
      }else{
        setStats((current) => ({ ...current, crimes }));

      }
    });

    StatsAPI.fires({
      postcode,
      start_year: 2010,
      count: 13,
      types: chartSelectedOptions.fires,
    }).then((fires: any) => {
      // @ts-ignore
      console.log('=== fires ===', fires)

      if(fires[0].type === undefined){
        setStats((current) => ({ 
          ...current, 
          fires: [
            {
            type: 'all' , 
            stats: fires
            }
          ]
        }));
      }else{
        setStats((current) => ({ ...current, fires }));

      }
      console.log('=== fires ===',stats)

    });
    console.log('=== stats ===', stats)
  }, [postcode, chartSelectedOptions]);
  const ChartCard = ({
    title = "",
    name = "",
    label = "",
    options = [""],
    data,
  }: any) => (
    <Fragment>
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <GridItem>
          <BoxTitle title={title} />
          <Text my={4}>
            {/* {console.log('=== stats =====', Object.values(data))} */}
            {/* {Object.values(data)?.reduce(
              // @ts-ignore
              (final = 0, current = 0) => (final += current),
              0
            )}{" "} */}
            {label}
          </Text>
        </GridItem>

        <GridItem className="grid-column-select">
          {/* <SelectComponent
          id={`data_crimes_${name}`}
          // defaultValue={defaultValue}
          // name={name}
          allOptions={
            name === 'crimes' ? crimesOptions : incidentsOptions
          }
          isMulti={true}
          getInitialDataBack={(data:any) => {
            let dataConvertedIntoStringArray = data.map((item: any) => item.value)
            console.log('=== value ===', dataConvertedIntoStringArray)
            console.log('=== name ===', name)
            setChartSelectedOptions((current) => ({
              ...current,
              [name]: dataConvertedIntoStringArray,
            }))
            // let indexedCrimeMethod = crimesOptions.findIndex((option)=> option.value === data.value)
            // console.log('=== === ===', indexedCrimeMethod)
            // setDefaultValue(indexedCrimeMethod)
            // if (
            //   value.includes("All") &&
            //   !(chartSelectedOptions as any)['crimes'].includes("All")
            // ) {
            //   setChartSelectedOptions((current) => ({
            //     ...current,
            //     ['crimes']: ["All"],
            //   }))
            // } else {
            //   setChartSelectedOptions((current) => ({
            //     ...current,
            //     ['crimes']: value.filter((v:any) => v !== "All"),
            //   }));
            // }
          }}
          /> */}
          <InputTypePicker
          
            name={name}
            placeholder={"Type of " + label}
            type="selectMany"
            checkedChartBox={(chartSelectedOptions as any)[name]}
            // checked={(chartSelectedOptions as any)[name].includes('type')}
            value={(chartSelectedOptions as any)[name]}
            onChange={(name = "", value = [""]) => {
                console.log('=== changed ===', value)
                setChartSelectedOptions((current) => ({
                  ...current,
                  [name]: value
                }));
              
            }}
            options={[
              ...options.map((option = "") => ({
                value: option,
                label: option,
              })),
            ]}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <AreaChart data={data} />
        </GridItem>
      </SimpleGrid>
    </Fragment>
  );

  const tabs = [
    {
      title: "Crime Statistics",
      body: (
        <ChartCard
          title="Crime Statistics"
          name="crimes"
          label="Crimes"
          data={stats.crimes}
          options={[
            "Criminal damage and arson",
            "Drugs",
            "Other crime",
            "theft",
            "Possession of weapons",
            "Public order",
            "Robbery",
            "Vehicle crime",
            "Violence and sexual offences",
          ]}
        />
      ),
    },
    {
      title: "Fire Incidents",
      body: (
        <ChartCard
          title="Fire Incidents"
          name="fires"
          label="Fire Incidents"
          data={stats.fires}
          options={[
            "Chimney fire",
            "Secondary Fire - accidental",
            "Secondary Fire - deliberate",
            "Primary fire - buildings"
          ]}
        />
      ),
    },
  ];

  return <CardComp body={<TabsComp tabs={tabs} />} />;
};

export default ResultsChartsBox;
