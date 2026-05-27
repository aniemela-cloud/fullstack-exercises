import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';

const CountryList = ({countrylist, country}) => {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryData, setCountryData] = useState(null)

  useEffect(() => {
    // check if we have a country selected
    if (selectedCountry) {
      axios.get(`${baseUrl}/name/${selectedCountry}`)
      .then((result) => {
        setCountryData(result.data)
        console.log('got country data: ',result.data)
      })
      .catch((error) => {
        console.log('error fetching country data: ',error)
      })
    };
  },[selectedCountry])

  const onFocusCountry = (name) => {
    console.log('onFocusCountry name: ', name);
    setSelectedCountry(name);
  }

  if (!countrylist) {
    return null;
  }
  if (!country) {
    return null;
  }
  if (selectedCountry &&
    !selectedCountry.toLowerCase().includes(country.toLowerCase())
  ) {
    // this is getting horrible. 
    // we see if we have a selected country that does
    // not match the current search string; this means
    // the search was modified after clicking a show button
    // that selects a country to show, and the selected
    // country won't be found in the list anymore. Clear
    // the selection.
    setSelectedCountry(null)
  }

  console.log("country is ", country);
  const filteredCountries = countrylist.filter(
    (name) => name.toLowerCase().includes(country.toLowerCase())
  );
  console.log("filteredCountries", filteredCountries)
  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, refine your filter.</p>
    )
  } else if (filteredCountries.length > 1) {
    return (
      <>
        {filteredCountries.map((name) => 
         <ListCountry name={name} 
          onClick={() => onFocusCountry(name)} key={name}/>) 
          }
        { selectedCountry !== null && <CountryInfo countryObject={countryData} />} 
      </>
    )
  } else if (filteredCountries.length === 1) {
    if (selectedCountry !== filteredCountries[0]) {
      setSelectedCountry(filteredCountries[0])
    }
    return (
      <CountryInfo countryObject={countryData} />
    );
  }

}

const ListCountry = ({name, onClick}) => {
  return (
    <p>
      {name} &nbsp;
      <button onClick={onClick}>show</button>
    </p>
  )
}

const CountryInfo = ({countryObject}) => {
  if (!countryObject) {
    return null;
  }
  console.log("languages: ", countryObject.languages);
  return (
    <div>
      <h1>{countryObject.name.common}</h1>
      <p>Capital: {countryObject.capital[0]} </p>
      <p>Area: {countryObject.area} km<sup>2</sup></p>
      <h2>Languages:</h2>
      <ul>
        {Object.keys(countryObject.languages).map((val) => <li key={val}>
          {countryObject.languages[val]}</li>)}
      </ul>
      <img src={countryObject.flags["png"]} alt={"Flag of "+countryObject.name.common} />
    </div>
  )
}

function App() {
  const [country, setCountry] = useState('');
  const [countrylist, setCountrylist] = useState(null);

  const updateCountry = (event) => { 
    setCountry(event.target.value);
  }
  useEffect(() => {
    // initial load fetches massive list of countries
    axios.get(`${baseUrl}/all`)
    .then((result) => {
      //console.log('got a result in api/all get', result)
      const country_array = result.data.map(country => country.name.common);
      //console.log('mapped to ',country_array)
      setCountrylist(country_array)
    })
    .catch((error) => {
      console.log('error fetching all countries ', error)
    })
  }
  ,[])


  return (
    <div>
      Find countries: <input name="countryInput"
        onChange={updateCountry}
        value={country} /> <br />
      <CountryList countrylist={countrylist} country={country} />
    </div>
  )
}

export default App
