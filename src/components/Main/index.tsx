import  React,  { useState, useEffect, useRef } from 'react';

//Local imports
import './Main.css';

//small images imports
import smallClear  from './img/smallclear.png';
import smallScattered from './img/smallScattered.png';
import smallBroken from './img/smallBroken.png';
import smallOvercast from './img/smallOvercast.png';
import smallLightRain from './img/smallLightRain.png';
import smallNight from './img/smallNight.png';
import smallModerateRain from './img/smallModerateRain.png';
import smallHeavyIntensityRain from './img/smallHeavyIntensityRain.png';

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

interface LogoArray {
    [key:string]: string,
}


let baseCity : APIDatas;


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
    // We use ref to focus on the div when a day is selected
    // TODO : adjust the focus even when the div display another day without being close first (by reclicking on the same day)
    let mainRef = useRef(null);


    //Use effect is used at the first rendering of the DOM
    useEffect(() => {
        //Let's get the data from the API
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
                    setCityForcast(data);
                    setError(false);
                    setLoader(true);
                })
            })
        },[mainRef]
    )
    
    // We get the city after the date is completed and put it into the variable currentCity
    let currentCity: APIDatas = cityForcast;

    // Converting the date from string to local date time to sort the date (from the data) first.
    const options: Object = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric'};
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
        // The Hourly forcast div only disapears if the user clicks on the same day. Otherwise it refresh to show the new day the user clicked on.
        if(daysID === day){
        setSelectedDay(!selectedDay);
        } else {
        setSelectedDay(true);
        setDaysId(day);
        ;
        }
        
    }

  

    return (
        <div className="container">
            {loader && 
                <div>
                    <div className="welcome">
                        Bienvenue à {currentCity.city.name} , la température actuelle est de : {currentCity.list[0].main.temp} °C nous sommes le {new Date().toLocaleDateString(undefined, options)}
                    </div>
                    
                    <div className="weekContainer">
                        {
                    
                        currentCity.list.map( (day, index) => {
                        //console.log('map', day, 'index:', index, 'et currentCity.list', currentCity.list)
                        // We want to show the first value of the array and then all the days to come with a default temperature sets on 12h.
                        // Had to add the && verification to avoid getting two div for the same day if it is before 9H, one at 9 and one at 12. Guess there is a simpler way to do it.
                        if (index === 0 || (midDayForecast(day.dt_txt) === 12 && (getSelectedDay(day.dt_txt) !== getSelectedDay(currentCity.list[0].dt_txt)))){
                        return (

                            <div className="dailyForcast" key={day.dt} onClick={() => {
                                handleClik(day.dt_txt)}}>
                                    <div className="dailyInfos">
                                        <p>{formatedDate(Date.parse(day.dt_txt))} {midDayForecast(day.dt_txt)}h. {/*et {midDayForecast(day.dt_txt) + typeof(midDayForecast(day.dt_txt))} et {getSelectedDay(day.dt_txt)*/}</p>
                            <p>Température : {day.main.temp}°C (ressentie {day.main.feels_like}°C)</p>
                                    </div>
                                    <div className={day.weather[0].description}></div>
                                    </div>
                        )
                        } else {
                            //Typescript warning if no return : TODO => search a way to avoid warning, maybe a filter before the map
                            return "";
                        }
                            })
                        }
                    </div>
                    
                </div>
            }
            {/** If the request from the API retrun an error, we just have to wish a nice and warm day to the user */}
            { error &&
                <p>
                    Pas de données météo pour cette ville, mais du soleil dans nos coeurs!
                </p>
            }
           {/** If the user clicks on a day, we show him the details of that day*/} 
            {
                selectedDay && 

                <div className="dailyDatas" ref={mainRef} tabIndex={-1}>
                
                {/* Filtering resulst to keep only datas of the selected day then mapping on those results*/}
                  { currentCity.list.filter( day => getSelectedDay(day.dt_txt) === getSelectedDay(daysID)).map( data => {
                    //console.log('data of the day', {...data}, data.dt_txt, data.weather[0].description)
                    //Let's check the weather and put the right icon depending the weather (I didn't covered all the weathers yet)
                    const logoToDisplay: LogoArray = {
                        "clear sky": smallClear,
                        "few clouds": smallScattered,
                        "scattered clouds": smallScattered,
                        "broken clouds": smallBroken,
                        "overcast clouds": smallOvercast,
                        "light rain": smallLightRain,
                        "moderate rain": smallModerateRain,
                        "heavy intensity rain": smallHeavyIntensityRain,
                        "night": smallNight
                    }
                    //Covering the case when the sun is not up yet
                    if(midDayForecast(data.dt_txt) <= 6 || midDayForecast(data.dt_txt) > 18){
                        data.weather[0].description = "night";
                    }
                    // }else if(data.weather[0].description === "clear sky"){
                    //     skyImg=smallClear;                        
                    // }else if(data.weather[0].description === "few clouds" ||data.weather[0].description === "scattered clouds"){
                    //     skyImg=smallScattered;
                    // } else if(data.weather[0].description === "broken clouds"){
                    //     skyImg=smallBroken;
                    // }else if(data.weather[0].description === "overcast clouds"){
                    // skyImg=smallOvercast;
                    // }else if (data.weather[0].description === "light rain"){
                    //     skyImg=smallLightRain;
                    // }else if (data.weather[0].description === "moderate rain"){
                    //     skyImg=smallModerateRain;
                    // }else if (data.weather[0].description === "heavy intensity rain"){
                    //     skyImg=smallHeavyIntensityRain;
                    // }
                    
                    // Then we return a div for every datas of the day selected presenting the user the weather and the temperature but we could add the wind too if nécessairy
                       return (
                            <div key={data.dt} className="dailyData">
                                <img src={logoToDisplay[data.weather[0].description]} alt={data.weather[0].description}></img>
                                <p>{`À ${midDayForecast(data.dt_txt)}h la température sera de ${data.main.temp}°C mais de ${data.main.feels_like}°C en ressenti`}</p>
                            </div>
                    )
                })}
        
                </div>
              
            }
        </div>
    )
}

export default Main;