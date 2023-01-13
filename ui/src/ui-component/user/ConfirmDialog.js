import React, {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import ConfirmBox from "react-dialog-confirm";
import '../../../node_modules/react-dialog-confirm/build/index.css';
import LOGOIMG from "../../assets/images/orion_logo.png"
import {useDispatch } from 'react-redux'
import styled from "styled-components";
import { blue } from '@mui/material/colors';
import { SET_MENU } from '../../store/actions';
import {useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { confirmAlert } from 'react-confirm-alert'; // Import
import '../../../node_modules/react-confirm-alert/src/react-confirm-alert.css';

const ConfirmDialog = () => {
    let navigate = useNavigate();
    const theme = useTheme();
  
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));
    const dispatch = useDispatch();  
    const handleConfirm = () => {
      return navigate("/."); }
    const handleCancel = () => { alert('Please click YES to load data!'); }
useEffect(() => {
  dispatch({ type: SET_MENU, opened: true });


}, [])

  return (
    <ConfirmBox // Note : in this example all props are required
    options={{
      color:"$ff45dd",
      icon:LOGOIMG,
      text: `There is no data to show! Would you want to load data?`,
      confirm: 'YES',
      cancel: 'NO',
      btn: true,
      color:"blue",
      backgroundColor:"red"
    }}
    isOpen={true}
    onConfirm={handleConfirm}
    onCancel={handleCancel}
  />
  )
}

export default ConfirmDialog