import { useEffect, useState } from "react"
import {requestApi, saveListToLocalStorage} from "../../services/weatherApi"
import { Button, Container, TextField } from "@mui/material"
import './ShowClime.css'


const ShowClime = () => {

    const [weatherData, setWeatherData] = useState(null)
    const [inputCity, setInputCity] = useState('')
    const [weatherList, setWeatherList] = useState([])
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


    return (
        <Container 
            className="container"
            maxWidth="lg" 
        >
            {weatherData &&
                <div>
                    <h1>
                    {`${weatherData.location.country}, ${weatherData.location.name}: ${weatherData.current.temp_c}°C`}
                    </h1>
                    <div className="condition">
                        <img src={weatherData.current.condition.icon} alt="Ícone do clima" />
                        <p>{weatherData.current.condition.text}</p>
                        <p>{`Umidade: ${weatherData.current.humidity}`}</p>
                        <p>{`Sensação Térmica: ${weatherData.current.feelslike_c}`}</p>
                        <p className="condition-text">
                            {`Verificado em: ${weatherData.current.last_updated}`}
                        </p>
                    </div>
                </div>
            }
            <TextField 
                id="outlined-basic" 
                label="Cidade" 
                variant="outlined" 
                onChange={handleChange}
            />
            <Button 
                variant="contained"
                onClick={() =>  searchCity()}
            >
                Buscar
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
