import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';

const CountryList = ({countrylist, country, setSelectedCountry}) => {
  if (!countrylist) {
    return null;
  }
  if (!country) {
    return null;
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
        {filteredCountries.map((name) => <p>{name}</p>)}
      </>
    )
  } else if (filteredCountries.length === 1) {
    setSelectedCountry(filteredCountries[0])
    return null;
  }

}

const CountryInfo = ({countryObject}) => {
  return null;
}

function App() {
  const [country, setCountry] = useState('');
  const [countrylist, setCountrylist] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryData, setCountryData] = useState(null)

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

  return (
    <div>
      Find countries: <input name="countryInput"
        onChange={updateCountry}
        value={country} /> <br />
      <CountryList countrylist={countrylist} country={country} 
        setSelectedCountry={setSelectedCountry}/>
      <CountryInfo countryObject={countryData} />
    </div>
  )
}

export default App
