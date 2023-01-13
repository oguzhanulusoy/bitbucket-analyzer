import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import Stack from "@mui/material/Stack";
import { DataGrid, GridToolbar, GridLinkOperator } from "@mui/x-data-grid";
import LoadingCircle from "../../../ui-component/user/LoadingCircle";
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {getLastPage} from "../../../redux/pull_request/PullRequestSlice"
import Diversity2Icon from '@mui/icons-material/Diversity2';
import FormControl from '@mui/material/FormControl';
import Box from "@mui/material/Box";
import PullRequestList from "../../../ui-component/user/PullRequestList";
import ReviewerList from "../../../ui-component/user/ReviewerList";
import ConfirmDialog from "../../../ui-component/user/ConfirmDialog";
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';
import axios from "axios";
import { getPullRequests } from "../../../redux/pull_request/PullRequestSlice";
import Slide from '@mui/material/Slide';
import { element } from "prop-types";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={props.in == true ? "up" : "down"} ref={ref} {...props} />;
});
const TransitionSubmit =React.forwardRef(function Transition(props, ref) {
  return <Slide direction={props.in == true ? "left" : "right"}  ref={ref} {...props} />;
});



function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

// ==============================|| Pull-Request PAGE ||============================== //


const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));


const teamNames = ["Unknown", "NRD12", "NRD1210", "NRD1211", "NRD1212", "NRD1213", "NRD1214", "NRD1221", "NRD1222"];

const getAuthorOpen = (arr) =>{
  return arr.filter((element)=> element.values.state=="OPEN")
}
const getAuthorDeclined = (arr) =>{
  return arr.filter((element)=> element.values.state=="DECLINED")
}
const getAuthorMerged  = (arr) =>{
  const newArr=  arr.filter((element)=> element.values.state=="MERGED")
  return newArr;
}
const getRefsTitle  = (arr, refTitle) =>{

  const newArr=  arr.filter((element) => {
    return (element.values.fromRef.displayId).includes(refTitle)
  })
  return newArr;
}

const getReviewersStatus = (arr, name, searchText) =>{
  const findReviewer = arr.filter((element)=> {
    return element.values.reviewers.find((foundReviewer)=> foundReviewer.status == searchText && foundReviewer.user.name == name)
  })
  return findReviewer;
}

const getProjectPullRequests = (arr, projectName) => {
return arr.filter((element) => {
  return element.values.fromRef.repository.project.key == projectName
})
}

const filteredProjects = (userProjects, allProjects) => {
  const newArr =  userProjects.filter((element) => {
    return allProjects.find((filtered) => {
      return element == filtered.values.key
    })
  })
  return newArr;
}

function createData(
  pr,
  id,
  name,
  displayName,
  teamName,
  userPullRequest,
  open_pr,
  declined_pr,
  merged_pr,
  bugfix,
  feature,
  issue,
  release,
  userReviewing,
  approved_rw,
  unapproved_rw,
  ...args
 
) {
  let projectObj={};
  for (let index = 0; index < args.length; index++) {
    let objKey = args[index][0];
    let objValue = args[index][1];
    projectObj={...projectObj, [objKey]:objValue}
  }
  return { pr, id, name, displayName,  
    teamName, userPullRequest, open_pr, 
    declined_pr, merged_pr, userReviewing,approved_rw, unapproved_rw,
    bugfix, feature, issue, release,
     ...projectObj};
}


const AuthorPage = () => {
  const dispatch = useDispatch();
    const totalUsers = useSelector(state => state.data.allUser)
    const allProjects = useSelector(state => state.project.allProjects)
    const pullRequest = useSelector(state => state.data.pullRequest)
    const activeUserPullRequests = useSelector(state => state.data.activeUserPullRequest)
    const inactiveUserPullRequests = useSelector(state => state.data.inactiveUserPullRequest)
    const activeUserReviewing = useSelector(state => state.data.activeUserReviewing)
    const inactiveUserReviewing = useSelector(state => state.data.inactiveUserReviewing)
    const projectNames = useSelector(state => state.data.projects)

  const [pageSize, setPageSize] = useState(25);
  const [pageNum, setPageNum] = useState(0);
  const [buttonText, setButtonText] = useState("Show Inactive Users")
const [showActive, setShowActive] = useState(false)
  const [data, setData] = useState(useSelector(state => state.data.allUser).filter((filteredUser) => {
    return filteredUser.user.active == true
  }))
  const [open, setOpen] = React.useState(false);
  const [currentData, setCurrentData] = useState({});
 const [userPullRequest, setUserPullRequest] = useState([]);
 const [userReviewer, setUserReviewer] = useState([]);
const [showMore, setShowMore] = useState(false);
const [showMoreReviewer, setShowMoreReviewer] = useState(false);
const [checkboxSelection, setCheckboxSelection] = useState(true);
const [teamButton, setTeamButton] = useState(false);
const [checkboxSelectedUsers, setCheckboxSelectedUsers] = useState([]);
const [teamText, setTeamText] = useState("");
const [selectedRows, setSelectedRows] = React.useState([]);
const [filterInfo, setFilterInfo] = useState({
  id: 1,
  columnField: '',
  operatorValue: '',
  value: '',
})


const updateDataWithTeam = (arr) => {

  let newData = (pullRequest.map((dataElement) => {
    let newTeamName = arr.find((element)=> {
      return element.user.id == dataElement.values.author.user.id
    })
        const newObj = {
          ...dataElement,
          values:{
            ...dataElement.values,
            author:{
              ...dataElement.values.author,
              teamName:newTeamName ? teamText : dataElement.values.author.teamName
            }
          }
        }
        return newObj;
      }))
  dispatch(getPullRequests([...newData]))

}

useEffect(() => {
  dispatch(getLastPage("authors")) 
}, [])




if(pullRequest.length <= 0 || !pullRequest){
  return (
    <ConfirmDialog/>
  ); 
}



// Helper functions


 const columns = [

    {
      field: "name",
      description: "This column shows user nick name",
      headerName: "Nick Name",
      headerClassName: 'super-app-theme--header',
      flex: 0.5,
    },
    {
        field: "displayName",
        description: "This column shows user display name",
        headerName: "Full Name",
        flex: 0.75,
    },
    
    {
      field: "teamName",
      description: "This column shows user team name",
      headerName: "Team",
      flex: 0.5,
    },
    {
      field: "userPullRequest",
      description: "This column shows total pull request of user",
      headerName: "PR",
      flex: 0.25,
    },
    {
      field: "open_pr",
      description: "This column shows total open pull request of user",
      headerName: "Open PR",
      flex: 0.5,
    },
    {
      field: "declined_pr",
      description: "This column shows total declined pull request of user",
      headerName: "Declined PR",
      flex: 0.5,
    },
    {
      field: "merged_pr",
      description: "This column shows total merged pull request of user",
      headerName: "Merged PR",
      flex: 0.5,
    },
    {
      field: "bugfix",
      description: "This column shows total bugfixs of pull request of user",
      headerName: "Bugfix",
      flex: 0.5,
    },
    {
      field: "feature",
      description: "This column shows total features of pull request of user",
      headerName: "Feature",
      flex: 0.5,
    },
    {
      field: "issue",
      description: "This column shows total issues of pull request of user",
      headerName: "Issue",
      flex: 0.5,
    },
    {
      field: "release",
      description: "This column shows total release of pull request of user",
      headerName: "Release",
      flex: 0.5,
    },
    {
      field: "userReviewing",
      description: "This column shows total reviewing of user (added to pull requests as a reviewers).",
      headerName: "Reviewing",
      flex: 0.5,
    },
    {
      field: "approved_rw",
      description: "This column shows total Approved reviewing of user",
      headerName: "Approved",
      flex: 0.5,
    },
    {
      field: "unapproved_rw",
      description: "This column shows total Unapproved reviewing of user",
      headerName: "Unapproved",
      flex: 0.5,
    },
   
    ...((filteredProjects(projectNames, allProjects)).map((element)=> {
      return {
          field: `${element}`,
          description:`This column shows total user's pull request of ${element}`,
          headerName: `${element} PR`,
          flex: 0.5,

    }})),
    {
      field: "info",
      description: "This column clickable for more information of user",
      headerName: "INFO",
      filterable: false,
      disableClickEventBubbling: true,
      disableExport: true,
      sortable: false,

      renderCell: (params) => {
        const onClick = (e) => {
          setCurrentData(params.row.pr);
          setUserPullRequest(pullRequest.filter((filteredPull) => {
            return filteredPull.values.author.user.name == params.row.pr.user.name
        }))
          setUserReviewer(pullRequest.filter((element)=>{
            return (element.values.reviewers.find((insideMap) => {
               return insideMap.user.name == params.row.pr.user.name
            }))
       }))
          
          handleClickOpen();
        };

        return (
          <Stack direction="row" spacing={2}>
            <IconButton onClick={onClick} sx={{ borderRadius: 25, color: "#21a2f6" }} aria-label="info">
<InfoIcon />
</IconButton>
          </Stack>
        );
      },
      flex: 0.25,
    },
    

 
  ];



 
  
  const rows = data.map((pr, index) => {
    return createData(
      pr,
      pr.user.id,
      pr.user.name,
      pr.user.displayName,
      pr.teamName,
      pr.user.active == true ? activeUserPullRequests[index].length : inactiveUserPullRequests[index].length,
      pr.user.active == true ? getAuthorOpen(activeUserPullRequests[index]).length : getAuthorOpen(inactiveUserPullRequests[index]).length,
      pr.user.active == true ? getAuthorDeclined(activeUserPullRequests[index]).length : getAuthorDeclined(inactiveUserPullRequests[index]).length,
      pr.user.active == true ? getAuthorMerged(activeUserPullRequests[index]).length : getAuthorMerged(inactiveUserPullRequests[index]).length,
      pr.user.active == true ? getRefsTitle(activeUserPullRequests[index], "bugfix").length : getRefsTitle(inactiveUserPullRequests[index], "bugfix").length,
      pr.user.active == true ? getRefsTitle(activeUserPullRequests[index], "feature").length : getRefsTitle(inactiveUserPullRequests[index], "feature").length,
      pr.user.active == true ? getRefsTitle(activeUserPullRequests[index], "issue").length : getRefsTitle(inactiveUserPullRequests[index], "issue").length,
      pr.user.active == true ? getRefsTitle(activeUserPullRequests[index], "release").length : getRefsTitle(inactiveUserPullRequests[index], "release").length,
      pr.user.active == true ? activeUserReviewing[index].length : inactiveUserReviewing[index].length,
      pr.user.active == true ? getReviewersStatus(activeUserReviewing[index], pr.user.name, "APPROVED").length : getReviewersStatus(inactiveUserReviewing[index], pr.user.name, "APPROVED").length,
      pr.user.active == true ? getReviewersStatus(activeUserReviewing[index], pr.user.name, "UNAPPROVED").length : getReviewersStatus(inactiveUserReviewing[index], pr.user.name, "UNAPPROVED").length,
      ...(filteredProjects(projectNames, allProjects).map((element)=>{
        const arr =  pr.user.active == true ? getProjectPullRequests(activeUserPullRequests[index], element).length : getProjectPullRequests(inactiveUserPullRequests[index], element).length;
        return [element, arr];
      }))

      );
  });

  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMore = () => {
    setShowMore(true)
  };
  const handleMoreReviewers = () => {
    setShowMoreReviewer(true)
  };
  const handleActiveButton = () =>{
        setShowActive((prev) => !prev)  
        setButtonText(`${showActive ? "Show Inactive Users" : "Show Active Users"}`)
        setData(totalUsers.filter((filteredUser) => showActive ? filteredUser.user.active == true : filteredUser.user.active == false))
  }

  
 
  const handleSubmitTeam = (selectedUser)=> {
    let newData = (data.map((dataElement) => {
      let newTeamName = selectedUser.find((element)=> {
        return element.user.id == dataElement.user.id
      })
          return {...dataElement, teamName:newTeamName ? teamText : dataElement.teamName}
        }))
    updateDataWithTeam(selectedUser);
    setData([...newData])
    setCheckboxSelectedUsers([]);
    setTeamText("");
    setSelectedRows([]);
    setTeamButton(false);
    const IDs = selectedUser.map((element) => {
      return element.user.name
    })
    const uniqueIDs = Array.from(new Set(IDs));
    const sendData = async () => {
      const dataResponse = await axios({
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        withCredentials: false,
        url: `http://localhost:8989/api/v1/update-data/${teamText}`,
        data: uniqueIDs,
      })
    }
    sendData();

  }
  const handleSelectClose = () =>{
    setTeamText("");
    setTeamButton(false)
  }
  const handleSelectChange = (event) => {
    setTeamText(event.target.value)
  }

  if (totalUsers.length <= 0) {
      return (
        <LoadingCircle/>
      );
    
  }


  if(showMore){
    return <PullRequestList data={{ open: showMore, setOpen: setShowMore, selectedPR: userPullRequest }}/>
  }

  if(showMoreReviewer){
    return <ReviewerList data={{ open: showMoreReviewer, setOpen: setShowMoreReviewer, selectedPR: userReviewer, selectedUser:currentData }}/>
  }

  return (
    <>
    <Dialog
        TransitionComponent={Transition}
        open={open}
        keepMounted
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move', fontWeight:"bold", fontSize:"20px" }} id="draggable-dialog-title">
          {Object.keys(currentData).length <=0 ? "Unknown" : currentData.user.displayName }
          <Typography  variant={'body2'} style={{ cursor: 'move', fontSize:"15px", color:"grey", fontWeight:"normal",  }}>
            {Object.keys(currentData).length <=0 ? "Unknown" : currentData.user.name }
          </Typography>
          <Typography  variant={'body2'} style={{ cursor: 'move', fontSize:"15px", color:"grey", fontWeight:"normal",  }}>
            {Object.keys(currentData).length <=0 ? "Unknown" : currentData.user.emailAddress}
          </Typography>
        </DialogTitle>
       
        <DialogContent>
          <DialogContentText style={{fontWeight:"bolder", fontSize:"15px"}}>
          <DialogTitle style={{fontWeight:"bold", marginLeft:"0px", display:"inline-block", fontSize:"15px" }} id="draggable-dialog-title">
          Total Pull Request Count:
        </DialogTitle>
            {userPullRequest.length}
          </DialogContentText>
          <DialogContentText style={{fontWeight:"bolder", fontSize:"15px"}}>
          <DialogTitle style={{fontWeight:"bold", marginLeft:"0px", display:"inline-block", fontSize:"15px" }} id="draggable-dialog-title">
          Total Reviewing Count:
        </DialogTitle>
            {userReviewer.length}
          </DialogContentText>
          <DialogContentText>
            To check all <Typography variant="h6" sx={{display:"inline"}} color="initial">pull requests</Typography> for <Typography variant="h5" sx={{display:"inline"}} color="initial">{Object.keys(currentData).length <=0 ? "Unknown" : currentData.user.name}</Typography> user click more button.
            <Button disabled={userPullRequest.length <=0 ? true : false} onClick={handleMore}>
            More
          </Button>
          </DialogContentText>
          <DialogContentText>
            To check all <Typography variant="h6" sx={{display:"inline"}} color="initial">reviewing</Typography> for <Typography variant="h5" sx={{display:"inline"}} color="initial">{Object.keys(currentData).length <=0 ? "Unknown" : currentData.user.name}</Typography> user click more button.
            <Button disabled={userReviewer.length <=0 ? true : false} onClick={handleMoreReviewers}>
            More
          </Button>
          </DialogContentText>
          
        </DialogContent>
        <DialogActions style={{display:"flex", justifyContent:"flex-start", alignContent:"center"}}>
          <Button onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    <Dialog
    TransitionComponent={TransitionSubmit}
    keepMounted
    open={teamButton}
    onClose={handleSelectClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
<FormControl sx={{ mt: 3, width:300, height:25, mb:10, mr:5, ml:5 }} variant="standard">
      <InputLabel htmlFor="demo-customized-select-native">Team Name</InputLabel>
        <NativeSelect
          id="demo-customized-select-native"
          value={teamText}
          onChange={handleSelectChange}
          input={<BootstrapInput />}
        >
          {teamNames.map((name)=>{
          return <option key={name} value={name}>{name}</option>
        })}
        </NativeSelect>
    </FormControl>
    <DialogActions>
      <Button onClick={handleSelectClose}>Close</Button>
      <Button onClick={()=>handleSubmitTeam(checkboxSelectedUsers)}>
        Submit
      </Button>
    </DialogActions>
  </Dialog>  
    <Box sx={{display:"flex", justifyContent:"space-between"}}>
    <Button onClick={handleActiveButton} sx={{borderRadius:"4px"}} variant="contained" endIcon={<VisibilityIcon />}>
  {buttonText}
</Button>
<Button disabled={checkboxSelectedUsers.length <= 0 ? true : false} onClick={()=> setTeamButton(true)} sx={{borderRadius:"4px"}} variant="contained" endIcon={<Diversity2Icon />}>ADD TEAM</Button>
    </Box>

      <Box m="20px 0 0 0" height="75vh" 
      sx={{
      backgroundColor:"white", 
      borderRadius:"20px", 
      border:"0px solid black !important",}}>
      
        <DataGrid
        disableSelectionOnClick
        checkboxSelection={checkboxSelection}
        sx={{backgroundColor:"white", borderRadius:"4px",
        border:"0px solid black !important",
        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {             
            display: "none",
            transform: "rotate(-45deg)"
        
        },}}
          rows={rows}
          getRowId={rows.id}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          rowsPerPageOptions={[10, 25, 50, 75, 100]}
          pageSize={pageSize}
          onPageChange={(newPage) => setPageNum(newPage)}
          onPageSizeChange={(newPage) => setPageSize(newPage)}
          onFilterModelChange={(props)=>{
            setFilterInfo({...filterInfo, ...props.items[0]})
           }}
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedArr = Array.from(selectedIDs)
            setSelectedRows(selectedArr);
            const selectedData = data.filter((element) => {
              return selectedArr.find((idElement) => {
                return element.user.id == idElement
              })
            }
            )
            setCheckboxSelectedUsers(selectedData);

          }}
          componentsProps={{
            filterPanel: {
              // Force usage of "And" operator
              linkOperators: [GridLinkOperator.And],
              // Display columns by ascending alphabetical order
              filterFormProps: {
                // Customize inputs by passing props
                linkOperatorInputProps: {
                  variant: 'outlined',
                  size: 'small',
                },
                columnInputProps: {
                  variant: 'outlined',
                  size: 'small',
                  sx: { mt: 'auto' },
                },
                operatorInputProps: {
                  variant: 'outlined',
                  size: 'small',
                  sx: { mt: 'auto' },
                },
                valueInputProps: {
                  InputComponentProps: {
                    variant: 'outlined',
                    size: 'small',
                  },
                },
                deleteIconProps: {
                  sx: {
                    '& .MuiSvgIcon-root': { color: '#d32f2f' },
                  },
                },
              },
              sx: {
                // Customize inputs using css selectors
                '& .MuiDataGrid-filterForm': { p: 2 },
                '& .MuiDataGrid-filterForm:nth-child(even)': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
                },
                '& .MuiDataGrid-filterFormLinkOperatorInput': { mr: 2 },
                '& .MuiDataGrid-filterFormColumnInput': { mr: 2, width: 150 },
                '& .MuiDataGrid-filterFormOperatorInput': { mr: 2, width:150 },
                '& .MuiDataGrid-filterFormValueInput': { width: 150 },
              },
            },
          }}
          selectionModel={selectedRows}
          initialState={{
            pagination: {
              page: pageNum,
            },
            
          }}

        />
      </Box>
      </>
    
  );
};

export default AuthorPage;

