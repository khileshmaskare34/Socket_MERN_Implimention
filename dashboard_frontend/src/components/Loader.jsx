import React from 'react'
import { GridLoader } from 'react-spinners';

const Loader = () => {
    return (
        <>
            <div className='loader'>
                <GridLoader color='#99e6d4'/>
            </div>
        </>
    )
}

export default Loader