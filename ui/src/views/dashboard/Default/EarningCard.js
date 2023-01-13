import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import SkeletonEarningCard from '../../../ui-component/cards/Skeleton/EarningCard';

// assets
import UserProfile from '../../../ui-component/user/UserProfile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = (props) => {
    const {isLoading, users, name} = props.data;
    const theme = useTheme();
    const count = users.length
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    if(open){
        return <UserProfile data={{open, setOpen, arr:users}}/>
      }
    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                        name={name}
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.secondary[800],
                                                color: theme.palette.grey[500],
                                                mt: 1,
                                                cursor:"default"
                                            }}
                                        >
                                        </Avatar>
                                    </Grid>
                                    <Grid sx={{pointerEvents:users.length > 0 ? "default" : "none"}} item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: theme.palette.grey[500],
                                                color: theme.palette.secondary[800],
                                                zIndex: 1,
                                                
                                            }}
                                            aria-controls="menu-earning-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                        {users.length > 0 
                                        ? 
                                        <VisibilityIcon fontSize="inherit" />
                                        :
                                        <VisibilityOffIcon fontSize="inherit" /> }
                                            
                                        </Avatar>

                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                            {count}
                                        </Typography>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.secondary[800]
                                    }}
                                >
                                    {name}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

EarningCard.propTypes = {
    isLoading: PropTypes.bool
};

export default EarningCard;
