import React, { useEffect, useState } from 'react'
import LabelerSalaryGraph from './LabelerSalaryGraph';

const LabelerSalaryData = ({user}) => {
    const [filter, setFilter] = useState('month'); // Default filter is 'month'
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
  
    // Function to handle filter change
    const handleFilterChange = (e) => {
      setFilter(e.target.value);
      // Reset dates if switching to 'month'
      if (e.target.value === 'month') {
        setStartDate('');
        setEndDate('');
      }
    };  

      // Helper function to get current month dates
    const getCurrentMonthDates = () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]; // Last day of the current month
        return { start, end };
    };

  // Function to fetch data based on the selected filter
  const fetchData = async () => {
    let url = '';
    if (filter === 'month') {
      const { start, end } = getCurrentMonthDates();
      url = `http://localhost:8000/labelers-salary?start_date=${start}&end_date=${end}`;
    } else if (filter === 'specific_date' && startDate && endDate) {
      url = `http://localhost:8000/labelers-salary?start_date=${startDate}&end_date=${endDate}`;
    } else if (filter === 'year') {
      const currentYear = new Date().getFullYear(); // Get the current year
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;
      url = `http://localhost:8000/labelers-salary?start_date=${startDate}&end_date=${endDate}`;
    }

    if (url) {
      try {
        const response = await fetch(url);
        const result = await response.json();
        console.log("response", result)
        setData(result);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  

  // Effect to fetch data when the filter or date range changes
  useEffect(() => {
    fetchData();
  }, [filter, startDate, endDate]);

  return (
    <>
     <div className="graph-data">
       <div className='card_top'>
           <h4>Labeler Salary To Be Credit This Month</h4>
           <select className='filter-datewish' value={filter} onChange={handleFilterChange}>
            <option value="month">Months</option>
            <option value="year">Years</option>
            <option value="specific_date">Specific Date</option>
           </select>

           {filter === 'specific_date' && (
            <div className='date-range'>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
       </div>
       <div className='number-box'>
      
       </div>  
     </div>
     <div className="graph-chart">
     <LabelerSalaryGraph data={data} />
     </div>
    </>
  )
}

export default LabelerSalaryData