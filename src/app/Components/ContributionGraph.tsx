import React, { useEffect, useState } from 'react';
import styles from './ContributionGraph.module.css';

import { addDays, format, eachDayOfInterval, addMonths, eachMonthOfInterval, addYears, add } from 'date-fns';
import { ru } from 'date-fns/locale';
import Tooltip, { ContributersProps } from '../UI/Tooltip';

type ContributionsData = {
  [date: string]: number;
};

const ContributionGraph = () => {
  const [jsonContributions, setJsonContributions] = useState<ContributionsData>({});
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<ContributersProps | null>(null);

  const handleCellClick = (date: string | null, count: number | null) => {
    if (date === null) {
      // Clicked on contributorsMarking cell
      const tooltipData: ContributersProps = { date: '', count: count !== null ? count : 0 };
      setTooltipData(tooltipData);
      setIsTooltipVisible(true);
    } else {
      // Clicked on regular date cell
      const tooltipData: ContributersProps = { date, count: count !== null ? count : 0 };
      setTooltipData(tooltipData);
      setIsTooltipVisible(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dpg.gg/test/calendar.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setJsonContributions(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const generateDaysArray = () => {
    const endDate = new Date();
    const startDate = add(endDate, { days: -356 });
    const daysArray = eachDayOfInterval({ start: startDate, end: endDate });
    const formattedDaysArray = daysArray.map((date) => format(date, 'yyyy-MM-dd'));
    return formattedDaysArray;
  };

  const generateMonthsArray = () => {
    const nextMonth = addMonths(addYears(new Date(), -1), 1);
    const currentMonth = new Date();
    const monthsArray = eachMonthOfInterval({ start: nextMonth, end: currentMonth });
    const formattedMonthsArray = monthsArray.map((date) =>
      format(date, 'LLL', { locale: ru })).map(month => month.charAt(0).toUpperCase() + month.slice(1));
    return formattedMonthsArray;
  };

  const getContributers = (date: string) => {
    const count = jsonContributions[date];
    return count ? parseInt(count.toString(), 10) : 0;
  };

  const getClassName = (count: number) => {
    if (count === 0) return styles.noContributions;
    else if (count >= 1 && count <= 9) return styles.low;
    else if (count >= 10 && count <= 19) return styles.mid;
    else if (count >= 20 && count <= 29) return styles.large;
    else return styles.extraLarge;
  };

  const contributorsMarking = [0, 1, 10, 20, 30];
  const monthsArray = generateMonthsArray();
  const daysArray = generateDaysArray();
  const WeekDays = ['Пн.', '', 'Ср.', '', 'Пт.', '', ''];

  return (
    <div className={styles.table}>
      <div className={styles.monthesCover}>
        <div className={styles.monthes}>
          {monthsArray.map((month, idx) => (
            <div key={idx}>{month}</div>
          ))}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.graphCover}>
          <div className={styles.weekdays}>
            {WeekDays.map((day, idx) => (
              <div key={idx}>{day}</div>
            ))}
          </div>
          <div className={styles.cells}>
            {daysArray.map((day, idx) => (
              <div
                key={idx}
                date-date={day}
                className={`${getClassName(getContributers(day))} ${styles.cell}`}
                date-contributers={getContributers(day)}
                onClick={() => handleCellClick(day, getContributers(day))}
              >
                {isTooltipVisible && tooltipData?.date === day && (
                  <Tooltip date={tooltipData.date} count={tooltipData.count} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.contributorsMark}>
          <div>Больше</div>
          <div className={styles.flexRow}>
            {contributorsMarking.map((value) => (
              <div
                key={value}
                date-contributers={value}
                className={`${styles.cell} ${getClassName(value)}`}
                onClick={() => handleCellClick('', value)}
              >
                {isTooltipVisible && tooltipData?.count === value && tooltipData?.date === '' && (
                  <Tooltip count={value} sign='+' />
                )}
              </div>
            ))}
          </div>
          <div>Меньше</div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
