import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ReviewerCard from './ReviewerCard';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const StyledBadge = styled(Badge)((props) => ({
  
  '& .MuiBadge-badge': {
    backgroundColor: `${props.active.toString() == "true" ? "#44b700" : "red" }`,
    color: `${props.active.toString() == "true" ? "#44b700" : "red" }`,
    boxShadow: `0 0 0 2px ${props.theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

function stringToColor(string="Unknown Unknown") {

  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name = "Unknown Unknown") {
  name = name.includes(" ") ? name : name+" ?";
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}


export default function UserProfile(props) {
  const {open, setOpen, arr} = props.data
  const handleClose = () => {
    setOpen(false)
  };

  return (
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative',  background:"green", background: "linear-gradient(90deg, rgba(255,221,116,1) 0%, rgba(255,237,182,1) 100%)", mb:5}}>
          <Toolbar sx={{ display:"flex", justifyContent:"space-between"}}>
          <Stack direction="row" spacing={2}>
          <Divider>
            <Chip sx={{backgroundColor:"#2196f3", color:"white", fontWeight:"bold"}} label={arr[0].user.active.toString() == "true" ? "ACTIVE USERS" : "INACTIVE USERS"} />
          </Divider>
          <Typography sx={{ ml: -1, flex: 1 }} variant="h5" component="div">
            {arr.displayName}
            <br/>
            {arr.emailAddress}
            </Typography>
          </Stack>
            
          <IconButton aria-label="delete" color="error" size="medium" onClick={handleClose}>
  <HighlightOffIcon  fontSize="medium" />
</IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{flexGrow:1}}>
        <Grid container spacing={2}>
        {arr.map((reviewer, index) => {
          return(
            <Grid key={index} sx={{display:"flex", justifyContent:"center", alignItems:"center"}} item xs={12} sm={6} md={6} lg={4} xl={3}>
            <ReviewerCard data={reviewer}/>
            <br></br>

            </Grid> 

          )
        })}
      </Grid>
                  
        </Box>
      </Dialog>
  );
}

