import React, { Component } from 'react';
import { appActions, prizeActions, participantActions } from '../_actions';
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
    CircularProgress
 } from '@material-ui/core';

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
            prizePage: 0,
            prizePerPage: 10,
            prizeTotal: 0,
            isPrizeLoading: false,
            pPage: 0,
            pPerPage: 10,
            pTotal: 0,
            isPLoading: false,
            openDialog: false,
            dialogText: null,
        }

        this.empFile = React.createRef();
        this.participantFile = React.createRef();

        console.log('prizeJson', prizeJson);
    }

    componentWillMount = () => {
        const { dispatch } = this.props;
        dispatch(appActions.setSiteTitle('Manage Registration'));
    }

    componentDidMount = () => {
        this.fetchPrizesTable();
        this.fetchParticipantsTable();
    }

    fetchPrizesTable = () => {
        const { prizePage, prizePerPage } = this.state;

        this.setState({
            isPrizeLoading: true
        });

        this.props.dispatch(prizeActions.getPrizesTable({page: prizePage+1, per_page: prizePerPage})).then(data => {
            this.setState({
                isPrizeLoading: false,
                prizeTotal: data.total
            })
        });
    }

    fetchParticipantsTable = () => {
        const { pPage, pPerPage } = this.state;

        this.setState({
            pLoading: true
        });

        this.props.dispatch(participantActions.getParticipantsTable({page: pPage+1, per_page: pPerPage})).then(data => {
            this.setState({
                pLoading: false,
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
            if(resp.cols.length >= 3 && resp.rows.length > 1) {
                insertData = resp.rows;
                this.props.dispatch(employeeActions.insertEmployeeExcel(insertData)).then(data => {
                    this.setState({
                        isPrizeLoading: false
                    }, this.fetchPrizesTable)
                });
            } else {
                this.setState({
                    openDialog: true,
                    dialogText: 'Cannot export excel file. Make sure to make 3 columns <div>(ID Number, Firstname, Lastname )</div>'
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
                insertData = resp.rows;
                this.props.dispatch(participantActions.insertParticipantExcel(insertData)).then(data => {
                    this.setState({
                        isPLoading: false
                    }, this.fetchParticipantsTable);
                });
            } else {
                this.setState({
                    openDialog: true,
                    dialogText: 'Cannot export excel file. Make sure to make 2 columns <div>(Firstname, Lastname )</div>'
                });
            }

            //event.target.value = null;
            this.participantFile.current.value = '';
        }
        });          
    }

    render = () => {

        const { classes, prizesTable, participantsTable } = this.props;

        const { prizePage, prizePerPage, prizeTotal, pPage, pPerPage, pTotal, openDialog, dialogText } = this.state;

        const prizeListColumns = [
            {
                name: 'Name',
                options: {
                    filter: false
                }
            },
            {
                name: 'Quantity Available',
                options: {
                    filter: false
                }
            }
        ];

        const availableColumns = [
            {
                name: 'Firstname',
                options: {
                    filter: false
                }
            },
            {
                name: 'Lastname',
                options: {
                    filter: false
                }
            }
        ];

        const options = {
            filter: true,
            serverSide: true,
            count: prizeTotal,
            page: prizePage,
            rowsPerPage: prizePerPage,
            rowsPerPageOptions: [12,24,prizeTotal],
            onTableChange: (action, tableState) => {
                console.log(action, tableState);
                switch(action) {
                    case 'changePage':
                    this.setState({
                        prizePage: tableState.page
                    }, this.fetchPrizesTable);
                    break;
                }
            },
            onChangeRowsPerPage: (numOfRows) => {
                this.setState({
                    prizePerPage: numOfRows
                }, this.fetchPrizesTable);
            },

            onRowsDelete: (data) => {
                let indexes = _.map(data.data, 'index');
                let idsToDelete = _.filter(prizesTable.data, (p, idx) => {
                    return _.includes(indexes, idx);
                });

                idsToDelete = _.map(idsToDelete, '_id');

                if(idsToDelete.length > 0) {
                    this.props.dispatch(employeeActions.deleteEmployees(idsToDelete)).then(data => {
                        this.fetchPrizesTable();
                    });
                }
            }
        };

        const pOptions = {
            filter: true,
            serverSide: true,
            count: pTotal,
            page: pPage,
            rowsPerPage: pPerPage,
            rowsPerPageOptions: [12,24,pTotal],
            onTableChange: (action, tableState) => {
                console.log(action, tableState);
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
            }
        };



        return (
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <Container maxWidth="xl">
                        <Grid container spacing={3}>
                            <Grid item xs={7}>
                                <Box display="flex" className={classes.headerBox}>
                                    <Typography variant="h6">Prizes on Spin Board</Typography>
                                    <Button variant="contained" className={classes.uploadButton} onClick={()=> this.empFile.current.click()}>UPLOAD EXCEL</Button>
                                    <input type="file" 
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                                        ref={this.empFile}
                                        onChange={this.empFileHandler.bind(this)}
                                        style={{ display: 'none' }}
                                    />
                                </Box>
                                <MUIDataTable
                                title={"Prize List"}
                                columns={prizeListColumns}
                                options={options}
                                data={prizesTable.data}
                                />
                            </Grid>
                            <Grid item xs={5}>
                            <Box display="flex" className={classes.headerBox}>
                                    <Typography variant="h6">Actual Prize Available</Typography>
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
                                columns={availableColumns}
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

    const { prizesTable } = state.prize;
    const { participantsTable } = state.participant;

    return {
        prizesTable,
        participantsTable
    }
}

export default CMS(connect(mapStateToProps)(withStyles(styles)(ManageRegistration)));