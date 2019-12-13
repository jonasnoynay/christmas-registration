import React, { Component } from 'react';
import { appActions, employeeActions, participantActions } from '../_actions';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme  } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import { ExcelRenderer } from 'react-excel-renderer';

import { 
    Grid,
    Container,
    Typography,
    Button,
    Box,
    Dialog,
    Modal,
    CircularProgress,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField,
    IconButton,
    RadioGroup,
    Radio,
    Paper,
 } from '@material-ui/core';

 import {Edit as EditIcon, Save as SaveIcon, Add as AddIcon, PostAdd as PostAddIcon } from '@material-ui/icons';

 const theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Nunito',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
    }
  });

import CMS from './CMS';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 100
    },
    paper: {
        padding: '10px 20px'
    },
    uploadButton: {
        marginLeft: '1em',
        ...theme.btn,
        color: '#ffffff',
        background: '#00bfa5',
        '&:hover': {
            background: "#007b6b",
         }
      
    },
    addButton: {
        marginLeft: 'auto',
        ...theme.addButton,
        ...theme.btn,
        color: '#ffffff',
        background: '#039be5',
        '&:hover': {
            background: "#0277bd",
         },
    },
    submitButton: {
        color: '#ffffff',
        background: '#0277bd',
        '&:hover': {
            background: "#01579b",
         },
    },
    deleteButton: {
        color: '#ffffff',
        background: '#d32f2f',
        '&:hover': {
            background: "#c62828",
         },
    },
    headerBox: {
        padding: '12px 0'
    },
    dialogInner: {
        padding: '1.5rem 2.5rem'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalForm: {
        maxWidth: 450,
        width: '100%',
        padding: '1em 2em'
    }
});


class ManageRegistration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            empPage: 0,
            empPerPage: 10,
            empTotal: 0,
            isEmpLoading: false,
            pPage: 0,
            pPerPage: 10,
            pTotal: 0,
            isPLoading: false,
            openDialog: false,
            dialogText: null,
            filterRegistered: [],
            filterWinner: [],
            empRowToUpdate: null,
            empSearchString: '',
            pSearchString: '',
            openEmployee: false,
            openParticipant: false,
            idnumber: '',
            fullname: '',
            registered: 0,
            participantfullname: '',
            submitLoading: false,
            successMessage: ''
        }

        this.empFile = React.createRef();
        this.participantFile = React.createRef();

        this.searchTimeout = null;
        this.empLoader = null;
        this.pLoader = null;

        this.handleChange = this.handleChange.bind(this);
        this.empTable = React.createRef();
        this.pTable = React.createRef();
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    closeModals = () => {
        if(!this.state.submitLoading) {
            this.setState({
                openEmployee: false,
                openParticipant: false
            });
        }
    }

    componentWillMount = () => {
        const { dispatch } = this.props;
        dispatch(appActions.setSiteTitle('Manage Registration'));
    }

    componentDidMount = () => {
        this.fetchEmployeesTable();
        this.fetchParticipantsTable();
    }

    fetchEmployeesTable = () => {
        const { empPage, empPerPage, filterRegistered, empSearchString } = this.state;

        this.setState({
            isEmpLoading: true
        });

        this.props.dispatch(employeeActions.getEmployeesTable({page: empPage+1, per_page: empPerPage, filterRegistered, searchString: empSearchString})).then(data => {
            this.setState({
                isEmpLoading: false,
                empTotal: data.total
            })
        });
    }

    fetchParticipantsTable = () => {
        const { pPage, pPerPage, filterWinner, pSearchString } = this.state;

        this.setState({
            isPLoading: true
        });

        this.props.dispatch(participantActions.getParticipantsTable({page: pPage+1, per_page: pPerPage, filterWinner, searchString: pSearchString})).then(data => {
            this.setState({
                isPLoading: false,
                pTotal: data.total
            })
        });
    }

    dialogClose = () => {
        this.empFile.current.value = '';
        this.setState({
            openDialog: false,
            dialogText: null
        });
    }

    updateEmpRow = rowIndex => {
        this.setState({
            empRowToUpdate: rowIndex
        });
    }

    saveEmpRow = tableMeta => {
       //TODO save
       console.log('saveEmpRow', tableMeta);

        const { employeesTable } = this.props;

        let dataToChange = employeesTable.data[tableMeta.rowIndex];

        if(dataToChange) {
            let dataCol = ['idnumber', 'fullname', 'registered'];
            let updateData = {};
            let id = dataToChange._id;

            _.forEach(dataCol, (col, i) => { 
                updateData[col] = tableMeta.rowData[i];
             });

             if(id && updateData) {
                this.props.dispatch(employeeActions.updateEmployeeData(id, updateData)).then(data => {
                    this.setState({
                        empRowToUpdate: null
                    }, this.fetchEmployeesTable);
                });
             }
        }
    }

    empFileHandler = (event) => {
        let fileObj = event.target.files[0];

        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            console.log(resp);
        if(err){
            console.log(err);            
        }
        else{
            let insertData = [];
            if(resp.cols.length >= 2 && resp.rows.length > 1) {
                resp.rows.shift();
                insertData = resp.rows;
                this.props.dispatch(employeeActions.insertEmployeeExcel(insertData)).then(data => {
                    this.setState({
                        isEmpLoading: false
                    }, this.fetchEmployeesTable)
                });
            } else {
                this.setState({
                    openDialog: true,
                    dialogText: 'Cannot export excel file. Make sure to make 2 columns <div>(ID Number, Fullname )</div><div>And first row as header.</div>'
                });
            }

            //event.target.value = null;
            this.empFile.current.value = '';
        }
        });          
    }

    participantFileHandler = (event) => {
        let fileObj = event.target.files[0];

        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            console.log(resp);
        if(err){
            console.log(err);            
        }
        else{
            let insertData = [];
            if(resp.cols.length >= 1 && resp.rows.length > 1) {
                resp.rows.shift();
                insertData = resp.rows;
                this.props.dispatch(participantActions.insertParticipantExcel(insertData)).then(data => {
                    this.setState({
                        isPLoading: false
                    }, this.fetchParticipantsTable);
                });
            } else {
                this.setState({
                    openDialog: true,
                    dialogText: 'Cannot export excel file. Make sure to make 1 column <div>(Fullname)</div><div>And first row is header.</div>'
                });
            }

            //event.target.value = null;
            this.participantFile.current.value = '';
        }
        });          
    }

    openNewEmployee = () => {
        this.setState({
            openEmployee: true
        });
    }

    openNewParticipant = () => {
        this.setState({
            openParticipant: true
        });
    }

    handleEmployeeSubmit = (e) => {
        e.preventDefault();

        this.setState({submitLoading: true}, () => {
            let insertData = {
                idnumber: this.state.idnumber,
                fullname: this.state.fullname,
                registered: this.state.registered
            };

            this.props.dispatch(employeeActions.addNewEmployee(insertData)).then(data => {
                this.setState({
                    submitLoading: false,
                    successMessage: 'Employee added successfully.'
                }, this.fetchEmployeesTable);
            });
        });
    }

    handleParticipantSubmit = (e) => {
        e.preventDefault();

        this.setState({submitLoading: true}, () => {
            let insertData = {
                participantfullname: this.state.participantfullname
            };

            this.props.dispatch(participantActions.addNewParticipant(insertData)).then(data => {
                this.setState({
                    submitLoading: false,
                    successMessage: 'Participant added successfully.'
                }, this.fetchParticipantsTable);
            });
        });
    }

    render = () => {

        const { classes, employeesTable, participantsTable } = this.props;

        const { empPage, 
            empPerPage, 
            empTotal, 
            pPage, 
            pPerPage, 
            pTotal, 
            openDialog, 
            dialogText, 
            empRowToUpdate, 
            empSearchString, 
            pSearchString, 
            isEmpLoading, 
            isPLoading, 
            openEmployee,
            submitLoading,
            successMessage,
            filterRegistered,
            filterWinner,
            openParticipant } = this.state;

            clearTimeout(this.empLoader);
            clearTimeout(this.pLoader);

            if(isEmpLoading == false && employeesTable.data && employeesTable.data.length == 0) {
                this.empLoader = setTimeout(()=> {
                    console.log(this.empTable.current.tableRef.getElementsByTagName('h6')[0].innerHTML = '<h2>No data available.</h2>');
                }, 2000);
            }

            if(isPLoading == false && participantsTable.data && participantsTable.data.length == 0) {
                this.empLoader = setTimeout(()=> {
                    console.log(this.pTable.current.tableRef.getElementsByTagName('h6')[0].innerHTML = '<h2>No data available.</h2>');
                }, 2000);
            }

        const empListColumns = [
            {
                name: 'ID Number',
                options: {
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            tableMeta.rowIndex == empRowToUpdate ? 
                                <FormControlLabel
                                    value={value}
                                    control={<TextField value={value} />}
                                    onChange={event => {updateValue(event.target.value)}}
                                /> : value
                        );
                    }
                },
            },
            {
                name: 'Fullname',
                options: {
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            tableMeta.rowIndex == empRowToUpdate ? 
                                <FormControlLabel
                                    value={value}
                                    control={<TextField value={value} />}
                                    onChange={event => updateValue(event.target.value)}
                                /> : value
                        );
                    }
                }
            },
            {
                name: 'Registered',
                options: {
                    filter: true,
                    filterType: 'checkbox',
                    filterList: filterRegistered,
                    filterOptions: {
                        names: ['Yes', 'No']
                    },
                    
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            tableMeta.rowIndex == empRowToUpdate ? 
                            <RadioGroup aria-label="gender" name="registered" value={value} onChange={event => updateValue(event.target.value)}>
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                            : value
                        );
                    }
                }
            },
            {
                name: 'Action',
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            tableMeta.rowIndex == empRowToUpdate ? 
                            <Button size={'small'} variant="contained" color="primary" onClick={ event => { this.saveEmpRow(tableMeta) }}>Save Changes</Button> :
                            <IconButton size={'small'} style={{ margin: '-8px 0' }} onClick={ event => { this.updateEmpRow(tableMeta.rowIndex) }}><EditIcon fontSize={'small'} /></IconButton>
                        );
                    }
                }
            },
        ];

        const participantColumns = [
            {
                name: 'Fullname',
                options: {
                    filter: false
                }
            },
            {
                name: 'Winner',
                options: {
                    filter: true,
                    filterType: 'checkbox',
                    filterList: filterWinner,
                    filterOptions: {
                        names: ['Yes', 'No']
                    },
                }
            },
        ];

        const options = {
            filter: true,
            serverSide: true,
            count: empTotal,
            page: empPage,
            searchText: empSearchString,
            rowsPerPage: empPerPage,
            rowsPerPageOptions: [10,20,empTotal],
            textLabels: {
                body: {
                    noMatch: <CircularProgress id="emp-loading-circle" />
                }
            },
            onFilterChange: (changedColumn, filterList) => {
                if(changedColumn == 'Registered') {
                    const idx = _.findIndex(empListColumns, o => { return o.name == changedColumn });
                    if(filterList[idx]) {
                        this.setState({
                            filterRegistered: filterList[idx]
                        }, this.fetchEmployeesTable);
                    }
                }
            },
            onTableChange: (action, tableState) => {
                switch(action) {
                    case 'changePage':
                    this.setState({
                        empPage: tableState.page,
                        empRowToUpdate: null,
                    }, this.fetchEmployeesTable);
                    break;
                }
            },
            onChangeRowsPerPage: (numOfRows) => {
                this.setState({
                    empPerPage: numOfRows
                }, this.fetchEmployeesTable);
            },

            onRowsDelete: (data) => {
                let indexes = _.map(data.data, 'index');
                let idsToDelete = _.filter(employeesTable.data, (p, idx) => {
                    return _.includes(indexes, idx);
                });

                idsToDelete = _.map(idsToDelete, '_id');

                if(idsToDelete.length > 0) {
                    this.props.dispatch(employeeActions.deleteEmployees(idsToDelete)).then(data => {
                        this.fetchEmployeesTable();
                    });
                }
            },

            onSearchChange: (searchString) => {

                clearTimeout(this.searchTimeout);

                if(searchString != null && searchString != '') {
                    this.searchTimeout = setTimeout(() => {
                        this.setState({
                            empSearchString: searchString
                        }, this.fetchEmployeesTable);
                    }, 800);
                }
            },

            onSearchClose: () => {
                this.setState({
                    empSearchString: ''
                }, this.fetchEmployeesTable);
            }
        };

        const pOptions = {
            filter: true,
            serverSide: true,
            count: pTotal,
            page: pPage,
            rowsPerPage: pPerPage,
            searchText: pSearchString,
            rowsPerPageOptions: [10,20,pTotal],
            textLabels: {
                body: {
                    noMatch: <CircularProgress />
                }
            },
            onFilterChange: (changedColumn, filterList) => {
                if(changedColumn == 'Winner') {
                    const idx = _.findIndex(participantColumns, o => { return o.name == changedColumn });
                    if(filterList[idx]) {
                        this.setState({
                            filterWinner: filterList[idx]
                        }, this.fetchParticipantsTable);
                    }
                }
            },
            onTableChange: (action, tableState) => {
                switch(action) {
                    case 'changePage':
                    this.setState({
                        pPage: tableState.page
                    }, this.fetchParticipantsTable);
                    break;
                }
            },
            onChangeRowsPerPage: (numOfRows) => {
                this.setState({
                    pPerPage: numOfRows
                }, this.fetchParticipantsTable);
            },
            onRowsDelete: (data) => {
                let indexes = _.map(data.data, 'index');
                let idsToDelete = _.filter(participantsTable.data, (p, idx) => {
                    return _.includes(indexes, idx);
                });

                idsToDelete = _.map(idsToDelete, '_id');

                if(idsToDelete.length > 0) {
                    this.props.dispatch(participantActions.deleteParticipants(idsToDelete)).then(data => {
                        this.fetchParticipantsTable();
                    });
                }
            },
            onSearchChange: (searchString) => {

                clearTimeout(this.searchTimeout);

                if(searchString != null && searchString != '') {
                    this.searchTimeout = setTimeout(() => {
                        this.setState({
                            pSearchString: searchString
                        }, this.fetchParticipantsTable);
                    }, 800);
                }
            },
            onSearchClose: () => {
                this.setState({
                    pSearchString: ''
                }, this.fetchParticipantsTable);
            }
        };



        return (
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <Container maxWidth="xl">
                        <Grid container spacing={3}>
                            <Grid item xs={7}>
                                <Box display="flex" className={classes.headerBox}>
                                    <Typography variant="h6">Pre - Registration</Typography>
                                    <Button variant="contained" className={classes.addButton} onClick={this.openNewEmployee}><AddIcon /> EMPLOYEE</Button>
                                    <Button variant="contained" className={classes.uploadButton} onClick={()=> this.empFile.current.click()}><PostAddIcon /> UPLOAD EXCEL</Button>
                                    <input type="file" 
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                                        ref={this.empFile}
                                        onChange={this.empFileHandler.bind(this)}
                                        style={{ display: 'none' }}
                                    />
                                </Box>
                                <MUIDataTable
                                title={"Employee List"}
                                columns={empListColumns}
                                options={options}
                                data={employeesTable.data}
                                ref={this.empTable}
                                />
                            </Grid>
                            <Grid item xs={5}>
                            <Box display="flex" className={classes.headerBox}>
                                    <Typography variant="h6">Raffle Participants</Typography>
                                    <Button variant="contained" className={classes.addButton} onClick={this.openNewParticipant}><AddIcon /> PARTICIPANT</Button>
                                    <Button variant="contained" className={classes.uploadButton} onClick={()=> this.participantFile.current.click()}><PostAddIcon /> UPLOAD EXCEL</Button>
                                    <input type="file" 
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                                        ref={this.participantFile}
                                        onChange={this.participantFileHandler.bind(this)}
                                        style={{ display: 'none' }}
                                    />
                                </Box>
                                <MUIDataTable
                                title={"Participants List"}
                                columns={participantColumns}
                                options={pOptions}
                                data={participantsTable.data}
                                ref={this.pTable}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                    <Dialog onClose={this.dialogClose} open={openDialog}>
                        <div className={classes.dialogInner}>
                            <Typography variant="h5" dangerouslySetInnerHTML={{ __html: dialogText}}></Typography>
                        </div>
                    </Dialog>
                    <Modal
                        className={classes.modal}
                        open={openEmployee}
                        onBackdropClick={this.closeModals}
                        >
                       <Paper className={classes.modalForm}>
                       <form onSubmit={this.handleEmployeeSubmit}>
                        <Typography variant="h5">Add New Employee</Typography>
                            <FormControl component="div" fullWidth>
                                <TextField
                                    required
                                    label="ID Number"
                                    className={classes.textField}
                                    margin="normal"
                                    fullWidth
                                    name="idnumber"
                                    onBlur={this.handleChange}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormControl component="div" fullWidth>
                                <TextField
                                    required
                                    label="Fullname"
                                    className={classes.textField}
                                    margin="normal"
                                    fullWidth
                                    name="fullname"
                                    onBlur={this.handleChange}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormControl component="div" fullWidth margin="normal">
                                <FormLabel component="legend">Registered</FormLabel>
                                <RadioGroup name="registered" defaultValue={'0'} onChange={this.handleChange} style={{ display: 'inline' }}>
                                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="0" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                            {submitLoading ? <CircularProgress style={{ margin: 'auto', display: 'block' }} /> :
                                successMessage != '' ? 
                                    <p>{successMessage}</p>
                                :
                                <React.Fragment>
                                    <Button type="button" variant="contained" className={classes.deleteButton} style={{ float: 'right', margin: '0 0 1em 1em' }} onClick={this.closeModals}>Close</Button>
                                    <Button type="submit" variant="contained" className={classes.submitButton} style={{ float: 'right', margin: '0 0 1em' }}>Submit</Button>
                                </React.Fragment>
                            }
                        </form>
                       </Paper>
                    </Modal>
                    <Modal
                        className={classes.modal}
                        open={openParticipant}
                        onBackdropClick={this.closeModals}
                        >
                       <Paper className={classes.modalForm}>
                       <form onSubmit={this.handleParticipantSubmit}>
                        <Typography variant="h5">Add New Participant</Typography>
                            <FormControl component="div" fullWidth>
                                <TextField
                                    required
                                    label="Fullname"
                                    className={classes.textField}
                                    margin="normal"
                                    fullWidth
                                    name="participantfullname"
                                    onBlur={this.handleChange}
                                    autoComplete="off"
                                />
                            </FormControl>
                            {submitLoading ? <CircularProgress style={{ margin: 'auto', display: 'block' }} /> :
                                successMessage != '' ? 
                                    <p>{successMessage}</p>
                                :
                                <React.Fragment>
                                    <Button type="button" variant="contained" className={classes.deleteButton} style={{ float: 'right', margin: '0 0 1em 1em' }} onClick={this.closeModals}>Close</Button>
                                    <Button type="submit" variant="contained" className={classes.submitButton} style={{ float: 'right', margin: '0 0 1em' }}>Submit</Button>
                                </React.Fragment>
                            }
                        </form>
                       </Paper>
                    </Modal>
                </div>
            </ThemeProvider>
        )
    }
}

const mapStateToProps = (state) => {

    const { employeesTable } = state.employee;
    const { participantsTable } = state.participant;

    return {
        employeesTable,
        participantsTable
    }
}

export default CMS(connect(mapStateToProps)(withStyles(styles)(ManageRegistration)));