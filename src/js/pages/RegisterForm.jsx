import React, { Component } from 'react';
import { appActions, employeeActions } from '../_actions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import SearchHead from '../_components/SearchHead';
import MaterialModal from '../_components/MaterialModal';

import Base from './Base';

import {
    Refresh,
    FilterList
} from '@material-ui/icons';
import { Typography } from '@material-ui/core';

const styles = theme => ({
});


class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employee_id: null,
            open: false,
            value: '',
            notFound: false
        }

        this.searchheadElement = React.createRef();
    }

    componentWillMount = () => {
        const { dispatch } = this.props;
        dispatch(appActions.setSiteTitle('Register'));
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        this.props.dispatch(employeeActions.searchEmployees(value)).then((employees) => {
            this.setState({
                notFound: employees.data.length == 0
            });
        });
    }

    handleSuggestionSelected = (e, { suggestion }) => {
        e.preventDefault();
        this.setState({
            employee_id: suggestion._id,
            open: true
        });

        this.props.dispatch(employeeActions.registerEmployee(suggestion._id)).then(employee => {
            setTimeout(() => {
                this.setState({ open: false });
                this.handleClose();
            }, 5000);
        });
    }

    handleBackdropClick = () => {
        this.setState({ open: false, notFound: false });
        this.searchheadElement.current.clearInput();
    }

    handleClose = () => {
        this.props.dispatch(employeeActions.closeRegisterEmployee());
        this.searchheadElement.current.clearInput();
        this.setState({ notFound: false });
    }

    render = () => {
        
        const { employees, registeredEmployee } = this.props;
        const { notFound } = this.state;

        return (
            <div className={'grid-register__container'}>
                <form className={'grid-register__container-inner'}>
                    <div className={'header-title'}></div>
                        <div className={'search__container'}>
                            <SearchHead
                                ref={this.searchheadElement}
                                placeholder="Input your name or ID"
                                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                                onSuggestionSelected={this.handleSuggestionSelected}
                                clearAll={this.clearSearchField}
                                onCloseInput={this.handleClose}
                                suggestions={employees}
                                helpers={({ classIcon })=> {
                                    return employees.data && [
                                        <Refresh
                                            key={'refresh_search'}
                                            className={classIcon}
                                            //onClick={this.loadEmployeeDTR}
                                        />,
                                        <FilterList key={'filter_search'} className={classIcon} />
                                    ]
                                }}
                            />
                            {notFound && 
                                <div style={{ background: 'rgba(111, 28, 28, 0.75)', padding: '5px 10px' }}><Typography variant="h4" style={{ color: '#ffffff', margin: '24px 0', fontWeight: 600, fontSize: 25 }}>Name not found or already registered. Please ask the event coordinator for assistance.</Typography></div>
                            }
                        </div>
                </form>
                <MaterialModal
                    open={this.state.open}
                    onBackdropClick={this.handleBackdropClick}
                    loaded={registeredEmployee}
                    title={'Registration success. Welcome to the party!'}
                    onClose={this.handleClose}
                >
                </MaterialModal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { employees, registeredEmployee } = state.employee;

    return {
        employees,
        registeredEmployee
    }
}

export default Base(connect(mapStateToProps)(withStyles(styles)(RegisterForm)));