import React, {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import {useDispatch } from 'react-redux'

import { SET_MENU } from '../../store/actions';
import {useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


const ConfirmDialog = () => {
  const [open, setOpen] = React.useState(false);
    let navigate = useNavigate();
    const theme = useTheme();
  
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));
    const dispatch = useDispatch();
    
    
    const handleConfirm = () => {
      return navigate("/."); 
    }


    const handleClose = () => { 
      alert('Please click YES to load data!'); }
      useEffect(() => {
      dispatch({ type: SET_MENU, opened: true });
    }, [])

  return (
    <Dialog
    open={open}
    onClose={handleClose}
    PaperComponent={PaperComponent}
    aria-labelledby="draggable-dialog-title"
  >
    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          There is no data to show! Would you want to load data?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleClose}>
            NO
          </Button>
          <Button onClick={handleConfirm}>YES</Button>
        </DialogActions>
     </Dialog>
  )
}

export default ConfirmDialog