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
    CircularProgress,
    FormControlLabel,
    TextField,
    IconButton,
    RadioGroup,
    Radio
 } from '@material-ui/core';

 import {Edit as EditIcon, Save as SaveIcon } from '@material-ui/icons';

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
        marginLeft: 'auto'
    },
    headerBox: {
        padding: '12px 0'
    },
    dialogInner: {
        padding: '1.5rem 2.5rem'
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
            empRowToUpdate: null,
            empSearchString: '',
            pSearchString: '',
        }

        this.empFile = React.createRef();
        this.participantFile = React.createRef();

        this.searchTimeout = null;
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
        const { pPage, pPerPage, pSearchString } = this.state;

        this.setState({
            isPLoading: true
        });

        this.props.dispatch(participantActions.getParticipantsTable({page: pPage+1, per_page: pPerPage, searchString: pSearchString})).then(data => {
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
            if(resp.cols.length >= 2 && resp.rows.length > 1) {
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

    render = () => {

        const { classes, employeesTable, participantsTable } = this.props;

        const { empPage, empPerPage, empTotal, pPage, pPerPage, pTotal, openDialog, dialogText, empRowToUpdate, empSearchString, pSearchString, isEmpLoading, isPLoading } = this.state;

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
                    filterList: ['Yes', 'No'],
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
                            <IconButton size={'small'} onClick={ event => { this.updateEmpRow(tableMeta.rowIndex) }}><EditIcon fontSize={'small'} /></IconButton>
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
            }
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
                    noMatch: <CircularProgress />
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
                console.log(action, tableState);
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
                                    <Button variant="contained" className={classes.uploadButton} onClick={()=> this.empFile.current.click()}>UPLOAD EXCEL</Button>
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
                                />
                            </Grid>
                            <Grid item xs={5}>
                            <Box display="flex" className={classes.headerBox}>
                                    <Typography variant="h6">Raffle Participants</Typography>
                                    <Button variant="contained" className={classes.uploadButton} onClick={()=> this.participantFile.current.click()}>UPLOAD EXCEL</Button>
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
                                />
                            </Grid>
                        </Grid>
                    </Container>
                    <Dialog onClose={this.dialogClose} open={openDialog}>
                        <div className={classes.dialogInner}>
                            <Typography variant="h5" dangerouslySetInnerHTML={{ __html: dialogText}}></Typography>
                        </div>
                    </Dialog>
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