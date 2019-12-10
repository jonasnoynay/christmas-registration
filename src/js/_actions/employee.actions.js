import { employeeConstants } from '../_constants';
import { employeeService } from '../_services';
import { __parse } from '../_helpers';

const runAction = (actionType, value) => {return { type: actionType,  ...value} };

const searchEmployees = keyword => {
    return async dispatch => {
        dispatch(runAction( employeeConstants.SEARCH_REQUEST, { keyword } ));
        try {
            const employees = await employeeService.searchEmployees({keyword}).then(response => __parse(response));
            dispatch(runAction( employeeConstants.SEARCH_SUCCESS, { employees } ));
            return Promise.resolve(employees);

        } catch (error) {
            dispatch(runAction( employeeConstants.SEARCH_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const registerEmployee = employeeid => {
    return async dispatch => {
        dispatch(runAction( employeeConstants.REGISTER_REQUEST, { employeeid } ));
        try {
            const employee = await employeeService.registerEmployee({employeeid}).then(response => __parse(response));
            setTimeout(() => {
                dispatch(runAction( employeeConstants.REGISTER_SUCCESS, { employee } ));
            }, 1000);
            return Promise.resolve(employee);

        } catch (error) {
            dispatch(runAction( employeeConstants.REGISTER_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const getParticipants = () => {
    return async dispatch => {
        dispatch(runAction( employeeConstants.PARTICIPANTS_REQUEST ));
        try {
            const participants = await employeeService.getParticipants().then(response => __parse(response));
            dispatch(runAction( employeeConstants.PARTICIPANTS_SUCCESS, { participants } ));
            return Promise.resolve(participants);

        } catch (error) {
            dispatch(runAction( employeeConstants.PARTICIPANTS_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const resetParticipants = () => {
    return dispatch => {
        dispatch(runAction( employeeConstants.PARTICIPANTS_RESET ));
    };
}

const getEmployeesTable = filters => {
    return async dispatch => {
        dispatch(runAction( employeeConstants.EMPLOYEESTABLE_REQUEST ));
        try {
            const employeesTable = await employeeService.getEmployeesTable(filters).then(response => __parse(response));
            dispatch(runAction( employeeConstants.EMPLOYEESTABLE_SUCCESS, { employeesTable } ));
            return employeesTable;

        } catch (error) {
            dispatch(runAction( employeeConstants.EMPLOYEESTABLE_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const updateEmployeeData = (id, data) => {
    return async dispatch => {
        dispatch(runAction( employeeConstants.UPDATE_REQUEST ));
        try {
            const success = await employeeService.updateEmployeeData(id, data).then(response => __parse(response));
            dispatch(runAction( employeeConstants.UPDATE_SUCCESS, { success } ));
            return success;

        } catch (error) {
            dispatch(runAction( employeeConstants.UPDATE_FAILURE, { error } ));
            return Promise.reject(error);
        }
    } 
}

const addNewEmployee = (data) => {
    return async dispatch => {
        dispatch(runAction( employeeConstants.NEW_REQUEST ));
        try {
            const success = await employeeService.addNewEmployee(data).then(response => __parse(response));
            dispatch(runAction( employeeConstants.NEW_SUCCESS, { success } ));
            return success;

        } catch (error) {
            dispatch(runAction( employeeConstants.NEW_FAILURE, { error } ));
            return Promise.reject(error);
        }
    } 
}

const insertEmployeeExcel = data => {
    return async dispatch => {
        dispatch(runAction( employeeConstants.INSERTEXCEL_REQUEST ));
        try {
            const employeesTable = await employeeService.insertEmployeeExcel({data}).then(response => __parse(response));
            dispatch(runAction( employeeConstants.INSERTEXCEL_SUCCESS, { employeesTable } ));
            return Promise.resolve(employeesTable);

        } catch (error) {
            dispatch(runAction( employeeConstants.INSERTEXCEL_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const closeRegisterEmployee = () => {
    return dispatch => {
        dispatch(runAction( employeeConstants.REGISTER_CLOSE ));
    };
}

const deleteEmployees = ids => {
    return async dispatch => {
        dispatch(runAction( employeeConstants.DELETE_REQUEST ));
        try {
            const response = await employeeService.deleteEmployees({ids}).then(response => __parse(response));
            dispatch(runAction( employeeConstants.DELETE_SUCCESS, { response } ));
            return Promise.resolve(response);

        } catch (error) {
            dispatch(runAction( employeeConstants.DELETE_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

export const employeeActions = {
    searchEmployees,
    registerEmployee,
    closeRegisterEmployee,
    getParticipants,
    getEmployeesTable,
    resetParticipants,
    insertEmployeeExcel,
    deleteEmployees,
    updateEmployeeData,
    addNewEmployee
}