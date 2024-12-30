import React, { useEffect, useState } from 'react'
import AFM_Graphs from './AFM_Graphs'
var api_url = import.meta.env.VITE_API_URL;

const AFM_Data = ({ refreshGraphs }) => {
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



// Helper function to get the current month's start and end dates without timezone issues
const getCurrentMonthDates = () => {
  const today = new Date();
  // Start of the current month
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  // End of the current month (0th day of the next month gives the last day of the current month)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  // Format the date as YYYY-MM-DD without converting to UTC
  const formattedStart = start.toLocaleDateString('en-CA'); // 'en-CA' ensures YYYY-MM-DD format
  const formattedEnd = end.toLocaleDateString('en-CA');
  
  return { start: formattedStart, end: formattedEnd };
};

  // Function to fetch data based on the selected filter
  const fetchData = async () => {
    let url = '';

    if (filter === 'month') {
      const { start, end } = getCurrentMonthDates();
      url = `${api_url}/uploadedFolders-Graph?start_date=${start}&end_date=${end}`;
    } else if (filter === 'specific_date' && startDate && endDate) {
      url = `${api_url}/uploadedFolders-Graph?start_date=${startDate}&end_date=${endDate}`;
    } else if (filter === 'year') {
      const currentYear = new Date().getFullYear(); // Get the current year
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;
      url = `${api_url}/uploadedFolders-Graph?start_date=${startDate}&end_date=${endDate}`;
    }

    if (url) {
      try {
        const response = await fetch(url);
        const result = await response.json();
        // console.log("response", result)
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  // Effect to fetch data when the filter or date range changes
  useEffect(() => {
    fetchData();
  }, [filter, startDate, endDate, refreshGraphs]);

  return (
    <>
     <div className="graph-data">
       <div className='card_top'>
           <h4>Total Uploaded Folders (By Engineer) This</h4>
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
       {data.length > 0 ? (
            <div className='number-box'>{data.length}</div>
          ) : (
            <p>No folders uploaded this {filter === 'month' ? 'month' : 'date range'}.</p>
        )}
       </div>  
     </div>
     <div className="graph-chart">
     {data.length > 0 ? (
         <AFM_Graphs key={data.length} data={data} />
          ) : (
         <AFM_Graphs key={0} data={[]} />
          )}
     </div>
    </>
  )
}

export default AFM_Data