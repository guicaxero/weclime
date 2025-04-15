import { useEffect, useState } from "react"
import {requestApi, saveListToLocalStorage} from "../../services/weatherApi"
import { Button, Container, TextField } from "@mui/material"
import './ShowClime.css'


const ShowClime = () => {

    const [weatherData, setWeatherData] = useState(null)
    const [inputCity, setInputCity] = useState('')
    const [weatherList, setWeatherList] = useState([])
    const [weatherForecast, setWeatherForecast] = useState(null)
    const [mode, setMode] = useState('current')
    const savedList = localStorage.getItem('Lista de Cidades');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requestApi('Rio de Janeiro')
                setWeatherData(data);
            } catch (error) {
                console.error('Falha na Requisição', error)
            }
        };

        fetchData();
    },[])
    
    const handleChange = (event) => {
        event.preventDefault
        setInputCity(event.target.value)
    }
    async function searchCity() {
        try {
            const data = await requestApi(inputCity)
            setWeatherData(data);
            if (!weatherList.some(i => i.location.name === data.location.name)) {
                setWeatherList(list => {
                    const newList = [...list, data];
                    const limitedList = newList.slice(-5);
                    saveListToLocalStorage(limitedList);
                    return limitedList;
                });
            }
        } catch (error) {
            console.error('Falha ao Buscar a cidade')
        }
    }

    async function reSearchCity(params) {
        const data = await requestApi(params)
        setWeatherData(data)
    }

    async function searchCityPrevision() {
        const API_KEY = '48bfdb31f6e440ffb55112831251504'
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${inputCity}&days=3&lang=pt`);
        const data = await res.json();
        setWeatherForecast(data)
        return data;
    }


    return (
        <Container 
            className="container"
            maxWidth="lg" 
        >
            {mode === 'current' && weatherData && (
                <div className="weather-current">
                    <h1>{`${weatherData.location.country}, ${weatherData.location.name}`}</h1>
                    <div className="condition">
                        <img src={weatherData.current.condition.icon} alt="Ícone do clima" />
                        <p><strong>{`${weatherData.current.temp_c}°C`}</strong></p>
                        <p>{weatherData.current.condition.text}</p>
                        <p>{`Umidade: ${weatherData.current.humidity}%`}</p>
                        <p>{`Sensação Térmica: ${weatherData.current.feelslike_c}°C`}</p>
                        <p className="condition-text">
                            {`Verificado em: ${weatherData.current.last_updated}`}
                    </p>
                    </div>
              </div>
              
            )}

            {mode === 'forecast' && weatherForecast && (
                <>
                    <h2>Previsão para os próximos 3 dias em {weatherForecast.location.name}</h2>
                    <div className="forecast">
                        {weatherForecast.forecast.forecastday.map((day, index) => (
                            <div key={index} className="forecast-day">
                                <p><strong>{day.date}</strong></p>
                                <img src={day.day.condition.icon} alt={day.day.condition.text} />
                                <p>{day.day.condition.text}</p>
                                <p>Máx: {day.day.maxtemp_c}°C</p>
                                <p>Mín: {day.day.mintemp_c}°C</p>
                            </div>
                        ))}
                    </div>
                </>
                    
            )}
            <TextField 
                id="outlined-basic" 
                label="Cidade" 
                variant="outlined" 
                onChange={handleChange}
            />
            <Button 
                variant="contained"
                onClick={() => { searchCity(), setMode('current')}}
            >
                Buscar
            </Button>
            <Button 
                variant="contained"
                onClick={() =>  {searchCityPrevision(), setMode('forecast')}}
            >
                Ver previsão para os próximos 3 dias
            </Button>
            <p className="city-label">Últimas consultas:</p>
            {savedList &&
                <div className="city-buttons">
                    {JSON.parse(savedList).map((i, index) => {
                        return <button onClick={() => reSearchCity(i.location.name)} key={index} >{i.location.name}</button>
                    })}
                </div>
            }
        </Container>

    )
}

export default ShowClime
