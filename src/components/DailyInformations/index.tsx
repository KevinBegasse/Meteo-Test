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

const DailyForcast: React.FC<Props> =({sky, hour, temp, feels}) => {
  let skyLogo = sky;
  
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
   if(hour <= 6 || hour > 18){
    skyLogo = "night";
   }

    
        return <div className="dailyDat">
                    <img src={logoToDisplay[skyLogo]} alt={skyLogo} />
                    <p>{`À ${hour}h la température sera de ${temp}°C mais de ${feels}°C en ressenti`}</p>
                </div>
    

    
} 

export default DailyForcast;