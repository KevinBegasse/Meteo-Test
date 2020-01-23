import React from 'react';

//small images imports
import smallClear  from './img/smallclear.png';
import smallScattered from './img/smallScattered.png';
import smallBroken from './img/smallBroken.png';
import smallOvercast from './img/smallOvercast.png';
import smallLightRain from './img/smallLightRain.png';
import smallNight from './img/smallNight.png';
import smallModerateRain from './img/smallModerateRain.png';
import smallHeavyIntensityRain from './img/smallHeavyIntensityRain.png';


interface Props {
  sky: string,
  hour:number,
  temp: number,
  feels:number
}


interface LogoArray {
  [key:string]: string,
}

const DailyForcast: React.FC<Props> =(props) => {
  let sky = props.sky;
  
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
   if(props.hour <= 6 || props.hour > 18){
    sky = "night";
   }

    
        return <div className="dailyDat">
                    <img src={logoToDisplay[sky]} alt={sky} />
                    <p>{`À ${props.hour}h la température sera de ${props.temp}°C mais de ${props.feels}°C en ressenti`}</p>
                </div>
    

    
} 

export default DailyForcast;