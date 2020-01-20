import React from 'react';



// interface Props {
//     all: number,
//     deg: number,
//     speed: number,
//     feels_like: number,
//     grnd_level: number,
//     humidity: number,
//     pressure: number,
//     seal_level :number,
//     temp: number,
//     temp_kf: number,
//     temp_max: number,
//     temp_min: number,
//     // weather: Array<string|number> 
//     dt: number,
//     dt_txt: string,
// }

interface Props {
    display : boolean
}

const DailyForcast: React.FC<Props> =({display}) => {
//   Function to obtain the number of the day the user clicked on
  function getSelectedDay (day: string) : number {
    let baseDay = new Date(day);
    return baseDay.getDay();
}


    if(display){
        return <div>test</div>
    }else {
        return <div>nope</div>
    }

    
} 

export default DailyForcast;