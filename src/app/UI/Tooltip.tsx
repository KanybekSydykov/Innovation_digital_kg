import React from 'react'
import styles from './Tooltip.module.css'
import { parse, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface ContributersProps{
  date?:string | any,
  count:number,
  sign?:string
}

const Tooltip:React.FC<ContributersProps> = ({date,count,sign}) => {

  const dateObject = parse(date, 'yyyy-MM-dd', new Date());
  let capitalizedDate = '';
  if(date){

    const formattedDate = format(dateObject, 'EEEE, LLLL dd, yyyy', { locale: ru });
    capitalizedDate = formattedDate
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }
  return (
    <div className={styles.tooltipCover}>
<div className={styles.tooltip}>
      <div className={styles.contributors}>{count}{sign} contributors</div>
      <div className={styles.date}>{capitalizedDate}</div>
    </div>
    </div>
    
  
  )
}

export default Tooltip