import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import Stack from "@mui/material/Stack";
import FullScreenDialog from "ui-component/user/FullScreenDialog";
import { DataGrid, GridToolbar, GridLinkOperator} from "@mui/x-data-grid";
import LoadingCircle from "ui-component/user/LoadingCircle";
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Box from "@mui/material/Box";
import axios from "axios";
import ConfirmDialog from "ui-component/user/ConfirmDialog";
import {getLastPage} from "../../../redux/pull_request/PullRequestSlice"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
// Helper functions
function createData(
  pr,
  id,
  author,
  emailAddress,
  slug,
  teamName,
  create,
  updated,
  commentCount,
  title
) {
  return { pr, id, author, emailAddress, slug, teamName, create, updated, commentCount, title };
}

const options = ['OPEN', 'MERGED', 'DECLINED'];



// ==============================|| Pull-Request PAGE ||============================== //

const PullRequestPage = () => {

  const dispatch = useDispatch();
  const pullRequest = useSelector(state => state.data.pullRequest);
  const [pageSize, setPageSize] = useState(25);
  const [pageNum, setPageNum] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState({});
  const [buttonsOpen, setButtonsOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [buttons, setButtons] = useState("OPEN")
  const openPR = useSelector(state => state.data.openPR);
  const mergedPR = useSelector(state => state.data.mergedPR);
  const declinedPR = useSelector(state => state.data.declinedPR)
  const [data, setData] = useState(openPR);
  const [filterInfo, setFilterInfo] = useState({
    id: 1,
    columnField: '',
    operatorValue: '',
    value: '',
  })

  useEffect(() => {
    dispatch(getLastPage("pull-requests")) 
  }, [])

if(pullRequest.length <= 0 || !pullRequest){
    return (
      <ConfirmDialog/>
    ); 
  }

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setButtonsOpen(false);
  };

  const handleToggle = () => {
    setButtonsOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setButtonsOpen(false);
  };

  const columns = [
    {
      field: "Arrow",
      headerName: "",
      filterable: false,
      disableClickEventBubbling: false,
      sortable: false,

      renderCell: (params) => <ArrowRightIcon/>,
      flex: 0.25,
    },
    {
      field: "author",
      description: "This column shows user nickname",
      headerName: "Author",
      flex: 0.5,
    },
    {
      field: "emailAddress",
      description: "This column shows user e-mail address",
      headerName: "E-mail",
      flex: 0.75,
    },
    {
      field: "slug",
      description: "This column shows the repository the user is working on",
      headerName: "Repository",
      flex: 0.5,
    },
    {
      field: "teamName",
      description: "This column shows user's team name",
      headerName: "Team Name",
      flex: 0.5,
    },
    {
      field: "create",
      description: "This column shows the pull request time was created",
      type: 'date',
      valueGetter: ({ value }) => value && new Date(value),
      headerName: "Created",
      flex: 0.5,
    },
    {
      field: "updated",
      description: "This column shows the pull request time was updated",
      headerName: "Updated",
      type: 'date',
      valueGetter: ({ value }) => value && new Date(value),
      flex: 0.5,
    },
    {
      field: "commentCount",
      description: "This column shows comments of the pull request",
      type:"number",
      headerName: "Comments",
      flex: 0.5,
    },

    {
      field: "title",
      description: "This column shows title of the pull request",
      headerName: "Title",
      flex: 1.5,
    },
    {
      field: "info",
      headerName: "INFO",
      filterable: false,
      description: "This column clickable for more information of user's pull requests",
      disableClickEventBubbling: true,
      sortable: false,

      renderCell: (params) => {
        const onClick = (e) => {
          setSelectedPR({ ...params.row.pr });
          setOpen(true);
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

  const rows = data.map((pr) => {
    return createData(
      pr,
      pr.id,
      pr.values.author.user.name,
      pr.values.author.user.emailAddress,
      pr.values.fromRef.repository.slug,
      pr.values.author.teamName,
      //new Date(pr.values.createdDate).toISOString().split("T")[0],
      pr.values.createdDate,
      pr.values.updatedDate,
      pr.values.properties.commentCount < 0 ? 0 : pr.values.properties.commentCount,
      pr.values.title
    );
  });

  if (data.length <= 0) {
    return (
      <LoadingCircle/>
    );
  }

  if (open) {
    return (
      <FullScreenDialog
        data={{ open: true, setOpen: setOpen, selectedPR: selectedPR }}
      />
    );
  }
  return (
    <>
    <Box>
    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={buttonsOpen ? 'split-button-menu' : undefined}
          aria-expanded={buttonsOpen ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={buttonsOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => {
                        handleMenuItemClick(event, index)
                        if(option !== buttons){
                          setData([])
                          if(option == "MERGED" && buttons != "MERGED"){
                            setData(mergedPR)
                          }
                          else if(option == "DECLINED" && buttons != "DECLINED"){
                            setData(declinedPR)

                          }
                          else if(option == "OPEN" && buttons != "OPEN"){
                            setData(openPR)

                          }
                        
                         setButtons(option)

                        }
  
                      }
                        
                      }
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      </Box>
      <Box>
   
      <Box m="20px 0 0 0" height="75vh" sx={{backgroundColor:"white", borderRadius:"20px", border:"0px solid black !important"}}>
        <DataGrid
          disableSelectionOnClick
        sx={{backgroundColor:"white", borderRadius:"4px", 
        border:"0px solid black !important",
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {             
              display: "none"
          
          },
      }}
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
          initialState={{
            pagination: {
              page: pageNum,
            },
            filter: {
      filterModel: {
        items: [filterInfo],
      },
      
    },
          }}
          
        ></DataGrid>
      </Box>
    </Box>
      </>
    
  );
};

export default PullRequestPage;
