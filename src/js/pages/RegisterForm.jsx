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

const styles = theme => ({
});


class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employee_id: null,
            open: false,
            value: ''
        }

        this.searchheadElement = React.createRef();
    }

    componentWillMount = () => {
        const { dispatch } = this.props;
        dispatch(appActions.setSiteTitle('Register'));
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        this.props.dispatch(employeeActions.searchEmployees(value));
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
        this.setState({ open: false });
    }

    handleClose = () => {
        this.props.dispatch(employeeActions.closeRegisterEmployee());
        this.searchheadElement.current.clearInput();
    }

    render = () => {
        
        const { employees, registeredEmployee } = this.props;

        return (
            <div className={'grid-register__container'}>
                <form className={'grid-register__container-inner'}>
                        <div className={'header-title'}></div>
                        <div className={'search__container'}>
                            <SearchHead
                                ref={this.searchheadElement}
                                placeholder="Search Employee name or ID"
                                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                                onSuggestionSelected={this.handleSuggestionSelected}
                                clearAll={this.clearSearchField}
                                //onCloseInput={this.handleCloseInput}
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