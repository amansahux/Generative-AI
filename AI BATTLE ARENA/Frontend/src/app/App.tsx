import React,{useEffect} from 'react'
import axios from 'axios'
const App = () => {
  async function fetchdata(){
 const res= await axios.get("/api/health")
  console.log(res)
  }
  useEffect(()=>{
    fetchdata()
  },[])
  return (
    <div>App</div>
  )
}

export default App