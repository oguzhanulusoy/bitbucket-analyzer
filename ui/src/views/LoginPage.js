import React, {useState, useEffect, useCallback} from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styled from "styled-components"
import axios from "axios";
import {useSelector, useDispatch } from 'react-redux'
import { getPullRequests, setLoadingText } from "../redux/pull_request/PullRequestSlice";
import { getProjects } from "../redux/projects/ProjectsSlice";

import LoadingCircle from "ui-component/user/LoadingCircle";
import { Navigate } from 'react-router-dom';


const LoginPage = () => {
  const [show, setShow] = useState(false);
  const [setupData, setSetupData] = useState(false);

  const page = useSelector(state => state.data.lastPage)
  const allData = useSelector(state => state.data.pullRequest)

  const dispatch = useDispatch();
  useEffect(() => {
    const getData = async () => {
      const dataResponse = await axios("http://localhost:8989/api/v1/get-data")
        dispatch(getPullRequests([...dataResponse.data]))
        const projectsResponse = await axios("http://localhost:8989/api/v1/get-projects")
        dispatch(getProjects([...projectsResponse.data]))
        if(dataResponse.data.length <= 0){
          dispatch(setLoadingText("Please wait, data download to database..."))
          const setupResponse = await axios("http://localhost:8989/api/v1/setup-data");
          dispatch(setLoadingText("Please wait, data is loading..."))
          const dataResponse = await axios("http://localhost:8989/api/v1/get-data")
          dispatch(getPullRequests([...dataResponse.data]))
          const projectsResponse = await axios("http://localhost:8989/api/v1/get-projects")
          dispatch(getProjects([...projectsResponse.data]))
        }
        setShow(true);

    }
    getData();
   }, []);

  const boxStyle = {
     width: '300px',
     height: '100px',
     backgroundColor: 'lightblue',
     border: '2px solid darkblue',
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     fontSize: '18px',
     color: 'darkblue',
     margin: '50px auto',
     borderRadius: '10px',
     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  if (!show) {
    return (
      <div style={boxStyle}>
        Data is loading, please wait...
      </div>
    );
  }

  return (<Navigate to={`/user/${page}`} />)
};

export default LoginPage;
