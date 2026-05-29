import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';
const openweatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const owApiKey = import.meta.env.VITE_OPENWEATHER_KEY;

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
  //console.log("languages: ", countryObject.languages);
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
      <WeatherInfo lat={countryObject.capitalInfo.latlng[0]} lon={countryObject.capitalInfo.latlng[1]}
        name={countryObject.capital[0]}
      />
    </div>
  )
}

const WeatherInfo = ({lat, lon, name}) => {
  const [weatherData, setWeatherData] = useState(null);
  /* weatherData = 
    {
      temp: float,
      wind: float,
      icon: string,
      alt: string
      }
  */

  useEffect(() => {
    const rqUrl = `${openweatherBaseUrl}?lat=${lat}&lon=${lon}&appid=${owApiKey}&units=metric`
    axios.get(rqUrl).
    then((result) => {
      console.log('weather info received: ', result.data)
      setWeatherData(
        { 
          temp: result.data.main.temp,
          wind: result.data.wind.speed,
          icon: result.data.weather[0].icon,
          alt: result.data.weather[0].main
        }
      );
    })
    .catch((error) => {
      console.log('error fetching openweather data: ',error)
      setWeatherData(null);
    })
  },[lat, lon]);
  if (!weatherData) {
    return null;
  }
  return (
    <div>
      <h2>Weather in {name}</h2>
      <p>Temperature {weatherData.temp} &#8451;</p>
      <img src={`https://openweathermap.org/payload/api/media/file/${weatherData.icon}.png`} alt={weatherData.alt} title={weatherData.alt} />
      <p>Wind {weatherData.wind} m/s</p>
    </div>
  );
// 
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
      // we don't store all the country info, but instead filter out the "common" names
      // and save those in a stateful variable
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
