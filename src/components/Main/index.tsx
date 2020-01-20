import  React,  { useState, useEffect, Children } from 'react';

//Local imports
import './Main.css';
// Tried to nest a child composant but got issue with the type validation
// import DailyInformations from '../DailyInformations';

// First we need to write the interfaces in order to type the object we will receive from de API
// Interface for the objet received
interface APIDatas {
    list: Array<DailyForecast>,
    city: City,
    country: string,
}

//Interface for the City Objet with id, name, coordonnates, timezone, sunrize and sunset which will be contained in the main objet APIDatas
interface City {
    id: number,
    name: string,
    coord : {
        lat: number,
        long: number
    },
    timezone: number,
    sunrise: number,
    sunset: number
}

//Interface for the forecast datas 
interface DailyForecast {
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        sea_level: number,
        grnd_level: number,
        humidity: number,
        temp_kf: number,
    }
    dt: number,
    dt_txt: string,
    weather: Array<Weather>,
    clouds: Clouds,
    wind: Wind,

}

interface Clouds {
    all : number;
}

interface Wind {
    deg: number,
    speed: number,
}

interface Weather {
    description: string,
    icon: string,
    id: number,
    main: string
}


let baseCity : APIDatas;
let dayClicked: Array<DailyForecast>;

const Main: React.FC = () => {
    //Definition of the state with the useState Hooks
    //Loader start on false before the request to database, when the request is completed it passes on true which permit to refresh the DOM
    const [loader, setLoader] = useState(false)
    // The Error state would appears if the request on API is incorrect
    const [error, setError] = useState(false);
    //The City Forcast represents the objet received from the API
    const[cityForcast, setCityForcast] = useState(baseCity);
    //The selectedDay is set to false and becomes true if the user clics on a day
    const [selectedDay, setSelectedDay] =useState(false)
    //The id is the number of the day clicked on by the users 
    const [daysID, setDaysId] = useState('');



    //Use effect is used at the first rendering of the DOM
    useEffect(() => {
        //Todo => Replace API KEY by process.env.REACT_APP_API_KEY
        fetch(`http://api.openweathermap.org/data/2.5/forecast?units=metric&id=2983990&APPID=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                if(res.status !==200) {
                    //If the request is incorrect, the error is set tu true and the conditionnal rendering will show the error message.
                    setError(true);
                    // In the case of an error after a first successfull request, we put the loader to false to make sur it will react as wanted.
                    setLoader(false)
                    return;
                }
                res.json().then(data => {
                    // Once the request is complete, we set the values as decided to acces the datas
                    console.log('data:', data)
                    setCityForcast(data);
                    setError(false);
                    setLoader(true);
                })
            })
        },[]
    )
    
    // We get the city after the date is completed and put it into the variable currentCity
    let currentCity: APIDatas = cityForcast;

    // Converting the date from string to local date time to sort the date (from the data) first.
    const options: Object = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'};
    function formatedDate(dateToFormate :number) : string {
        return new Date(dateToFormate).toLocaleDateString(undefined, options);
    }

    //Function to obtain the hours of each datas in order to show the weather forecast at 12 for the days of the week.
    function midDayForecast( dt : string) : number {
        let baseDate = new Date(dt);
        return baseDate.getHours();
    }

    //Function to obtain the number of the day the user clicked on
    function getSelectedDay (day: string) : number {
        let baseDay = new Date(day);
        return baseDay.getDay();
    }

    //Function to react on the user's click on the day of the week he wants details on
    function handleClik(day: string) : void {
        setSelectedDay(!selectedDay);
        setDaysId(day);
        
    }

    return (
        <div>
            {loader && 
                <div className="container">
                    <div>
                        Bienvenue à {currentCity.city.name} , la température actuelle est de : {currentCity.list[0].main.temp} °C nous sommes le {new Date().toLocaleDateString(undefined, options)}
                    </div>
                    <div className="weekContainer">
                        {
                    
                        currentCity.list.map( (day, index) => {
                        console.log('map', day, 'index:', index, 'et currentCity.list', currentCity.list)
                        // We want to show the first value of the array and then all the days to come with a default temperature sets on 12h.
                        if (index === 0 || midDayForecast(day.dt_txt) === 12){
                        return (

                            <div className="dailyForcast" key={day.dt} onClick={() => {
                                console.log('click daily');
                                handleClik(day.dt_txt)}}>
                                    <p>{formatedDate(Date.parse(day.dt_txt))} et {midDayForecast(day.dt_txt) + typeof(midDayForecast(day.dt_txt))} et {getSelectedDay(day.dt_txt)}</p>
                        <p>ciel : {day.weather[0].description} température : {day.main.temp}°C et ciel : {day.weather[0].description}</p>
                                </div>
                        )
                        } else{
                            return ""
                        }
                            })
                        }
                    </div>
                    
                </div>
            }

            { error &&
                <p>
                    Pas de données météo pour cette ville, mais du soleil dans nos coeurs!
                </p>
            }

            {
                selectedDay && 

                <div>
                
                {/* Filtering resulst to keep only datas of the selected day then mapping on those results*/}
                  { currentCity.list.filter( day => getSelectedDay(day.dt_txt) === getSelectedDay(daysID)).map( data => {
                    console.log('data of the day', {...data}, data.dt_txt, data.weather[0].description)
                       return (
                            <div key={data.dt}>
                                <p>{` ${formatedDate(Date.parse(data.dt_txt))} le temps sera ${data.weather[0].description} la température sera de ${data.main.temp}°C mais de ${data.main.feels_like}°C en ressenti`}</p>
                            </div>
                    )
                })}
        
                </div>
              
            }
        </div>
    )
}

export default Main;