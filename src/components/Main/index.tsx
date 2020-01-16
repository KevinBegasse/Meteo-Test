import  React,  { useState, useEffect } from 'react';
import axios from 'axios';

interface APIDatas {
    list: Array<Object>,
    city: City,
    country: string,
}

interface City {
    id: Number,
    name: string,
    coord : {
        lat: Number,
        long: Number
    },
    timezone: Number,
    sunrise: Number,
    sunset: Number
}

let baseCity : APIDatas;

const Main: React.FC = ({}) => {
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState(false);
    const[cityForcast, setCityForcast] = useState(baseCity);
    useEffect(() => {
        console.log('on lance fetch');
        fetch(`http://api.openweathermap.org/data/2.5/forecast?cnt=7&units=metric&id=2983989&APPID=d02c19588f3d2c2f36afd7891ffbba44`)
            .then(res => {
                if(res.status !==200) {
                    setError(true);
                    setLoader(false)
                    return;
                }
                res.json().then(data => {
                    console.log('data:', data)
                    setCityForcast(data);
                    setError(false);
                    setLoader(true);
                })
            })
        },[]
    )
    

    let currentCity = cityForcast;
    return (
        <div>
    {loader && 
    <div>Bienvenue à {currentCity.city.name} {console.log(`dans le render`, currentCity)}  </div>
    }
    { !loader &&
        <p>
            Pas de données météo pour cette ville, mais du soleil dans nos coeurs!
        </p>
    }
    </div>
    )
}

export default Main;