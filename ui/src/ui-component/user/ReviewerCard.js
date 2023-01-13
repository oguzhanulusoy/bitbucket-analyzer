import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
//----------------------------------------
import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import TotalIncomeCard from '../../ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 350,
        height: 350,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 250,
        height: 250,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));




const StyledBadge = styled(Badge)((props) => ({
  
  '& .MuiBadge-badge': {
    backgroundColor: `${props.active == true ? "#44b700" : "red" }`,
    color: `${props.active == true ? "#44b700" : "red" }`,
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


const ReviewerCard = ({data}) => {

  const isLoading = false;
  const theme = useTheme();

  return (
      <>
          {isLoading ? (
              <TotalIncomeCard />
          ) : (
              <CardWrapper sx={{minWidth:"375px", borderColor:theme.palette.warning.dark}} border={true} content={false}>
                                    <Box sx={{color:"black", textAlign:"end", position:"absolute", right:"5px"}}>{data.teamName}</Box>

                  <Box sx={{ pt: 2, pb:2, pl:1, pr:1 }}>

                      <List sx={{ py: 0 }}>
                          <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                              <ListItemAvatar>
                              <StyledBadge
  overlap="circular"
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  variant="dot"
  active={data.user.active}
>
<Avatar {...stringAvatar(data.user.displayName)} />
</StyledBadge>
                              </ListItemAvatar>
                              <ListItemText
                                  sx={{
                                      py: 0,
                                      mt: 0.45,
                                      mb: 0.45,
                                      zIndex:1000,
                                  }}
                                  primary={<Typography variant="h4">{data.user.displayName}</Typography>}
                                  secondary={
                                      <Typography
                                          variant="subtitle3"
                                          sx={{
                                              color: "black",
                                              mt: 0.5
                                          }}
                                      >{data.user.emailAddress}
                                          
                                      </Typography>
                                  }
                                
                              />
                          </ListItem>
                      </List>
                  </Box>
              </CardWrapper>
          )}
      </>
  );
};

ReviewerCard.propTypes = {
  isLoading: PropTypes.bool
};

export default ReviewerCard;


/*

export default function ReviewerCard({data}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{minWidth:325, maxWidth:500, backgroundColor:"#e0e0e0" }}>
      <Stack sx={{mt:3, ml:3, display:"flex", justifyContent:"space-between", alignItems:"center"}} direction="row" spacing={2}>
          <StyledBadge
  overlap="circular"
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  variant="dot"
  active={data.user.active}
>
<Avatar {...stringAvatar(data.user.displayName)} />
</StyledBadge>
          </Stack>
      <CardHeader
        title={data.user.displayName}
        subheader={data.user.emailAddress}
        sx={{mt:0}}
      />

    </Card>
  );
}

*/