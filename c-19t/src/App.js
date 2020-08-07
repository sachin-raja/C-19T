import React, {useState, useEffect} from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from './Table'
import  './Table.css';
import { sortData, prettyPrintStat } from "./util"
import LineGraph from "./LineGraph"
import "leaflet/dist/leaflet.css"

//use BEM naming convention

/*
https://c-19-tracker.web.app
1. Create WireFrame - Overview of my program -----> what do you want tp build ---> Draw.io
2. create-react-app 
3. Cleanup Project
4. Structure of my program ----> Covid Tracker
5. Create Header
6. information boxes
7. Create table
8. Create Chart
9. Create Map
10. Create Styling ----> mateial ui
11. Deploy
*/
/*
Covid API
https://disease.sh/docs/

https://console.firebase.google.com/u/0/project/c-19-tracker/hosting/main

https://material-ui.com/getting-started/installation/


https://www.chartjs.org/docs/latest/charts/line.html

https://react-leaflet.js.org/

USEEFFECT = runs a piece of code
based on  a given

STATE  = A variable in react

useEffect(() => {
  //async -> send a request and wait for it and do something with the data
  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then((response) => response.json())
    .then((data) => {
      const countries = data.map((country) => (
        {
          name: country.country,
          value: country.countryInfo.iso2
        }
      ))
    })
  }
}, []);

use effect will run the piece of code the number of times specified

USEEFFECT(function, number of times in array)

*/ 


function App() {
  //get Countries
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);




  useEffect(() => {
    //async -> send a request and wait for it and do something with the data
    const getCountriesData = async () => {
    // use async await to do a API call to get ccounteyies
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);
  
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' 
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[code]

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(countryCode);

      // it has all the data
      // from country response
      setCountryInfo(data);
      console.log(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4);
    })
  };
// console.log("Country Info ",countryInfo);

  return (
    <div className="app">
      <div className="app_left">
        {/* {Header} */}
        {/* {Title + select input dropdown} */}
        <div className="app_header">
          <h1> C-19 T</h1>
          <FormControl className="app_dropdown"> 
            <Select variant = "outlined" value = {country} onChange = {onCountryChange} >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* looping through all the countries and show in the dropdown */}
              {/* <MenuItem value="worldwide">worldwide</MenuItem>
              <MenuItem value="worldwide">1</MenuItem>
              <MenuItem value="worldwide">2</MenuItem>
              <MenuItem value="worldwide">3</MenuItem>
              <MenuItem value="worldwide">4</MenuItem> */}
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        {/*-------------------Components---------------- */}
        {/* Infoboxes */}
        {/* Infoboxes */}
        {/* Infoboxes */}
        <div className="app_stats">
          <InfoBox isRed active={casesType === "cases"} onClick = { e => setCasesType('cases')} title="Coronavirus Cases" cases ={prettyPrintStat(countryInfo.todayCases)} total = {prettyPrintStat(countryInfo.cases)}/>

          <InfoBox active={casesType === "recovered"} onClick = { e => setCasesType('recovered')} title="Recovered" cases ={prettyPrintStat(countryInfo.todayRecovered)} total = {prettyPrintStat(countryInfo.recovered)}/>

          <InfoBox isRed active={casesType === "deaths"} onClick = { e => setCasesType('deaths')} title="Deaths" cases ={prettyPrintStat(countryInfo.todayDeaths)} total = {prettyPrintStat(countryInfo.deaths)} />
        </div>



        {/* {Map} */}
        <Map casesType= {casesType} countries={mapCountries} center = {mapCenter} zoom = {mapZoom}/>
      </div>
      <Card className="app_right">
        <CardContent>
          Live Cases from all the world in graph
        {/* {Table} */}
          <Table countries = {tableData} />
        
        {/* {Graph} */}
          <h3 className = "app_graphTitle">Worlds Daily new {casesType}: </h3>
          <LineGraph className="app_graph" casesType= {casesType} />
        </CardContent>

      </Card>
    </div>
  ); 
}

export default App;
