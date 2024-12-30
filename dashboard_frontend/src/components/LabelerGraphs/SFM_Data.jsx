import React, { useEffect, useState } from 'react'
import SFM_Graph from './SFM_Graph';
var api_url = import.meta.env.VITE_API_URL;

const SFM_Data = ({user}) => {
    
// console.log("uhey luck", user)
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
      url = `${api_url}/submittedFolders-PL-Graph?start_date=${start}&end_date=${end}&userId=${user._id}`;
    } else if (filter === 'specific_date' && startDate && endDate) {
      url = `${api_url}/submittedFolders-PL-Graph?start_date=${startDate}&end_date=${endDate}&userId=${user._id}`;
    } else if (filter === 'year') {
        const currentYear = new Date().getFullYear(); // Get the current year
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
        url = `${api_url}/submittedFolders-PL-Graph?start_date=${startDate}&end_date=${endDate}&userId=${user._id}`;
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
                    <h4>Folders Submitted This</h4>
                    <select className='filter-datewish' value={filter} onChange={handleFilterChange}>
                        <option value="month">Months</option>
                        <option value="year">Yearly</option>
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
                     <p>No folders submitted this {filter === 'month' ? 'month' : 'date range'}.</p>
                    )}
                </div>
            </div>
            <div className="graph-chart">
              {data.length > 0 ? (
                <SFM_Graph key={data.length} data={data}/>
              ) : (
                <SFM_Graph key={0} data={[]}/>
              )}
            </div>
        </>
    )
}

export default SFM_Data