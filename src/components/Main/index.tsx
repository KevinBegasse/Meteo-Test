import  React,  { useState, useEffect } from 'react';


// First we need to write the interfaces in order to type the object we will receive from de API
// Interface for the objet received
interface APIDatas {
    list: Array<DailyForecast>,
    city: City,
    country: string,
}

//Interface for the City Objet with id, name, coordonnates, timezone, sunrize and sunset which will be contained in the main objet APIDatas
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

//Interface for the forecast datas 
interface DailyForecast {
    main: {
        temp: Number,
        feels_like: Number,
        temp_min: Number,
        temp_max: Number,
        pressure: Number,
        sea_level: Number,
        grnd_level: Number,
        humidity: Number,
        temp_kf: Number,
    }

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
    <div>
        <div>Bienvenue à {currentCity.city.name} {console.log(`dans le render`, currentCity)}, la température actuelle est de : {currentCity.list[0].main.temp} °C </div>
            <div>{currentCity.list.map( day => {
               console.log('map', day)
               return (<p>{day.main.temp}</p>)
                })
            }</div>
            </div>
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