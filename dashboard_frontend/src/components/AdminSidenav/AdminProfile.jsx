import React from 'react'

const AdminProfile = ({ data }) => {
  console.log("data", data)
  return (
    <>
      <div className="profilex">
        <div className='profile-card'>
          {/* <div className="image-card">
            <img src="" alt="" />
            <input type="file" />
          </div> */}

          <div className="details-card">
            <input type="text" placeholder='Name' value={data.Name} />
            <input type="text" placeholder='Name' value={data.Email} />
            {/* <input type="text" placeholder='Name' /> */}
            {/* <button className='action-button'>Edit</button> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminProfile