import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import banner from './banner.svg';
import spaceicon from './space-shuttle.png';
import './App.css';

function App() {

//Initial data fetched from API
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

//Variables for filter
const [types, setTypes] = useState(null);
const [statusList, setStatus] = useState(null);
const [launchList, setLaunch] = useState(null);

const [filterParamLaunch, setFilterParamLaunch] = useState(null);
const [filterParamType, setFilterParamType] = useState(null);
const [filterParamStatus, setFilterParamStatus] = useState(null);

const [resultList,setResultList] = useState(null);
const [resultItem,setResultItem] = useState(null);

const [showPopupValue, setPopup] = useState(false);

//fecthing data from API
useEffect(() => {
    loadData()
  }, [])
  
  const loadData = () => {
    const header = new Headers({ "Access-Control-Allow-Origin": "*" });
    fetch("http://localhost/Assignments/productlisting/productlist/rest/", { header: header })
    .then(response => {
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      response.json().then(data => {
        setData(data)
        setResultList(data);
        const typesData = [...new Set(data.map((item) => item.type))];
        setTypes(typesData);
        const statusData = [...new Set(data.map((item) => item.status))];
        setStatus(statusData);
        const launchData = [...new Set(data.map((item) => item.original_launch))];
        setLaunch(launchData);
        
      })
    })
    .catch((err) => {
      setError(err.message);
     })
     .finally(() => {
      setLoading(false);
    });

  }
  
  function Header() {
    return (
    <header className="Header">
    <div className="Inner-header">
      <div className="Img-wrap">
        <img src={logo} className="Logo" alt="logo" />
      </div>
    </div>
  </header>
  );
  }

  function Banner() {
    return (
      <div className="Banner-section">
      <div className="Banner-wrap">
        <div className="Banner-content">
          <div className="Title">What is Lorem Ipsum?</div>
          <div className="Desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
          <div className="Btn">See Now</div>
        </div>

        <div className="Img-wrap">
          <img src={banner} className="Banner-img" alt="Banner" />
        </div>

      </div>
    </div>
  );
  }


//Filter search Logic
  function searchData(items) {
    var filterValues = [];
    if(filterParamType){filterValues.push("type")}
    if(filterParamStatus){filterValues.push("status")}
    if(filterParamLaunch){filterValues.push("original_launch")}
    console.log(filterValues);
    const itemsArr = Object.values(items);
    const finalResult = itemsArr[0].filter((item) => {

      if((filterValues.length == 3) && (item.type == filterParamType) && (item.status == filterParamStatus) && (item.original_launch == filterParamLaunch)){
        return item;
      }
      else if (filterValues.length == 2){
        var filterParams = [];
        var first = filterValues[0];
        var second = filterValues[1];
        if(first == "type") filterParams.push(filterParamType);
        if((first == "status")  || (second == "status")) filterParams.push(filterParamStatus);
        if(second == "original_launch") filterParams.push(filterParamLaunch);
        if((item[first] == filterParams[0]) && (item[second] == filterParams[1])){ return item; }

      }
      else if (filterValues.length == 1){
        var val1 = filterValues[0];
        var filterParam = '';
        if(val1 == "type") filterParam = filterParamType;
        if(val1 == "status") filterParam = filterParamStatus;
        if(val1 == "original_launch") filterParam = filterParamLaunch;
        if(item[val1] == filterParam){ return item; }
        
      }
      else if(filterValues.length == 0){
        return item;
      }
    
    });

    console.log(finalResult);
    setResultList(finalResult);
}

//Popup show/hide
function showPopup(item){
  setResultItem(item);
  setPopup(true);
}

  return (
    <div className="App">
      {/* Header section */}
      <Header />
      {/* Banner section */}
      <Banner />
    {(loading) ? (<div class="Loading">Loading...</div>) : (
    <div className="Filter-section">
    <div className="Filter-title">Search Capsules</div>
      <div className="Filter-content">
        <div className="Filter-type">
        <select
        onChange={(e) => {
        setFilterParamType(e.target.value);
        }}
       className="custom-select"
       aria-label="Filter by Type">
        <option value="">All Types</option>
        {data &&
              types.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}

        </select>
        <span className="focus"></span>
        </div>

        <div className="Filter-status">
        <select
        onChange={(e) => {
          setFilterParamStatus(e.target.value);
        }}
       className="custom-select"
       aria-label="Filter By status">
        <option value="">All Status</option>
        {data &&
              statusList.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}

        </select>
        </div>
        <div className="Filter-launch">
        <select

        onChange={(e) => {
          setFilterParamLaunch(e.target.value);
        }}
       className="custom-select"
       aria-label="Filter By Launch">
        <option value="">All Launches</option>
        {data &&
              launchList.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}

        </select>
        </div>
        <div className="Search-btn" onClick={() => searchData({data})}>Search</div>
      </div>
      </div>
      )}
       {/* List section */}   

      <div className="List-section">
        <div className="List">
          <ul className="List-items">
            {data && (resultList.length > 0) ? (
              resultList.map((item) => (
                <li key={item.capsule_serial}>
                  <div className="List-item">
                    <div className="Img-wrap">
                      <img src={spaceicon} className="List-icon" alt="List Icon" />
                    </div>
                    <div className="Serial">{item.capsule_serial}</div>
                    <div className="Type"><span>Type: </span> {item.type}</div>
                    <div className="Status"><span>Status: </span>{item.status}</div>  
                    <div className="Cta" onClick={() => showPopup({item})}>See More</div> 
                  </div>
                </li>

              ))) : (<li className="No-result">No Result found! </li>)
              
              }
            
          </ul>
          {showPopupValue &&
          <div className='Popup-section'>
            <div className="Popup-content">
              <div className='Popup-title'>More Details</div>
              {resultItem && 
              <ul className="Popup-info"> 
                  <li><span>Capsule Serial: </span>{resultItem.item.capsule_serial}</li>
                  <li><span>Capsule Id: </span>{resultItem.item.capsule_id}</li>
                  <li><span>Description: </span>{resultItem.item.details}</li>
                  <li><span>Type: </span>{resultItem.item.type}</li>
                  <li><span>Status: </span>{resultItem.item.status}</li>
                  <li><span>landings: </span>{resultItem.item.landings}</li>
              </ul>
              }
              <div className="Popup-close" onClick={() => setPopup(false)}>Close</div>
            </div>
          </div>
          }
        </div>
      </div>

    </div>
  );
}

export default App;
