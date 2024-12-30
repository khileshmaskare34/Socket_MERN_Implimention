import React, { useEffect, useState } from 'react'
import Loader from '../Loader'
import axios from 'axios'
var api_url = import.meta.env.VITE_API_URL;

const SalaryCredited = () => {

  const [creditedFolder, setCreditedFolder] = useState('')
  const [loading, setLoading] = useState(true)



  const fetchCreditedFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/labeler-salary-credited`);
      const finalCheckedData = response.data.finalCheckedFolders;
      setCreditedFolder(finalCheckedData);
      console.log("resp", finalCheckedData)
    } catch (error) {
      console.log("error fetching folders", error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreditedFolders();
  }, [])

 

 

  // check if data arrived or not, if not arrived show loader
  if(loading){
    return (
     <div>
      <Loader/>
     </div>
    ) 
  }
  
  return (
    <>
      <div className="assigned-folders">
        <h1>Credited</h1>
        <table className="assignFolderTable">
          <thead>
              <tr>
                <th>Folder Name</th>
                <th>Assigned By</th>
                <th>Assigned To</th>
                <th>Image Count</th>
                <th>Labeled Image</th>
                <th>Checked Image</th>
                <th>Final Checked Image</th>       
                <th>Submission Based Salary</th>
                <th>Checked Based Salary</th>
                <th>Final Checked Based Salary</th>  
                <th>Updated Salary</th>
                <th>Sub Data Type</th>
                <th>Credited Date</th>
                <th>Uploaded Date</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody>
            {creditedFolder.length > 0 ? (
              creditedFolder.map((folder, index)=>(
              <tr>
                <td>{folder.folderName}</td>
                <td>{folder.assigned_by.Name}</td>
                <td>{folder.assigned_to.Name}</td>
                <td>{folder.totalImageCount}</td>
                <td>{folder.totalLabeledImageCount}</td>
                <td>{folder.totalCorrectLabeledImageCountNF}</td>
                <td>{folder.totalCorrectLabeledImageCountF}</td>
                <td> 
                 <i class="fa-solid fa-indian-rupee-sign"></i>  {folder.submissionBasedSalary}
                </td>
                <td> 
                 <i class="fa-solid fa-indian-rupee-sign"></i>  {folder.checkedBasedSalary}
                </td>
                <td>
                  <i class="fa-solid fa-indian-rupee-sign"></i>  {folder.salary}
                </td>
                <td>
                  <i class="fa-solid fa-indian-rupee-sign"></i>  {folder.updatedSalary}
                </td>
                <td>{folder.subDataType.subDataTypeName}</td>
                <td>{new Date(folder.creditedDate).toLocaleString()}</td>
                <td>{new Date(folder.createdAt).toLocaleString()}</td>
                <td><button class="action-button">{folder.status}</button></td> 
              </tr>
              ))
            ) : (
              <tr>
                <td>No creditedFolder Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default SalaryCredited

