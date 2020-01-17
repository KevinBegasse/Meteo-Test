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
    dt_txt: string,
    weather: Array<Weather>,

}

interface Weather {
    description: string,
    icon: string,
    id: Number,
    main: string
}

let baseCity : APIDatas;

const Main: React.FC = ({}) => {
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState(false);
    const[cityForcast, setCityForcast] = useState(baseCity);
    useEffect(() => {
        console.log('on lance fetch');
        //Todo => Replace API KEY by process.env.REACT_APP_API_KEY
        fetch(`http://api.openweathermap.org/data/2.5/forecast?units=metric&id=2983990&APPID=d02c19588f3d2c2f36afd7891ffbba44`)
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
    

    let currentCity: APIDatas = cityForcast;
    // To convert the date from string to local date time to sort the date (from the data) first.
    const options: Object = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'};
    function formatedDate(dateToFormate :number) : string {
        return new Date(dateToFormate).toLocaleDateString(undefined, options);
    }
    //Function to obtain the hours of each datas in order to show the weather forecast at 12 for the days of the week.
    function midDayForecast( dt : string) : number {
        let baseDate = new Date(dt);
        return baseDate.getHours();
    }
    
    //Seconds in 24h : 86400000
    return (
        <div>
    {loader && 
    <div>
        <div>Bienvenue à {currentCity.city.name} , la température actuelle est de : {currentCity.list[0].main.temp} °C nous sommes le {new Date().toLocaleDateString(undefined, options)}</div>
            <div>{
               
                // midDayTab.list.filter(day => 
                //     new Date Date.parse(dt_txt).getHours === 12)
            
            currentCity.list.map( (day, index) => {
               console.log('map', day)
               if (midDayForecast(day.dt_txt) === 12){
               
               
               return (
                   <div key={index}>
                        <p>{day.main.temp}, {midDayForecast(day.dt_txt)}</p>
               <p>{formatedDate(Date.parse(day.dt_txt))} ciel : {day.weather[0].description} </p>
                    </div>
               )
               }
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