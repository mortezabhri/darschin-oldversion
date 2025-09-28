
export default function GetDateToday(date = null) {
       const allDateToday = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric'});
       const getDay = new Date().toLocaleDateString('fa-IR', { day: 'numeric' });
       const getWeekday = new Date().toLocaleDateString('fa-IR', { weekday: 'long' });
       const getMonth = new Date().toLocaleDateString('fa-IR', { month: 'long' });
       const getNumeric = new Date().toLocaleDateString('fa-IR', { month: 'numeric' });
       const getYear = new Date().toLocaleDateString('fa-IR', { year: 'numeric'});
     
       switch(date){
              case "year" : return getYear ;
              case "month" :  return getMonth ; 
              case "monthNumeric" :  return getNumeric ; 
              case "day" : return getDay ;
              case "weekday" : return getWeekday ;
              default : return allDateToday ;
       }
}
