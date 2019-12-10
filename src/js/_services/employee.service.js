import config from 'config';
import { unauthorized, fetchEncode } from '../_helpers';

const searchEmployees = async (keyword) => {
    const request = {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(keyword)
    }

    return fetch(`${config.apiUrl}/employees/search`, request)
    .then(unauthorized);
}

const registerEmployee = async (employeeid) => {
    const request = {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(employeeid)
    }

    return fetch(`${config.apiUrl}/employee/register`, request)
    .then(unauthorized);
}

const getParticipants = async () => {
    const request = {
        method: 'GET',
        headers: {'Content-Type' : 'application/json'}
    }

    return fetch(`${config.apiUrl}/participants`, request)
    .then(unauthorized);
}

const getEmployeesTable = async filters => {
    const request = {
        method: 'GET',
        headers: {'Content-Type' : 'application/json'}
    }

    return fetch(`${config.apiUrl}/employees/table?${fetchEncode(filters)}`, request)
    .then(unauthorized);
}

const insertEmployeeExcel = async data => {
    const request = {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
    }

    return fetch(`${config.apiUrl}/employees/excel/insert`, request)
    .then(unauthorized);
}

const updateEmployeeData = async (id, data) => {
    const request = {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
    }

    return fetch(`${config.apiUrl}/employee/update/${id}`, request)
    .then(unauthorized);
}

const addNewEmployee = async (data) => {
    const request = {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
    }

    return fetch(`${config.apiUrl}/employee/new`, request)
    .then(unauthorized);
}

const deleteEmployees = async ids => {
    const request = {
        method: 'DELETE',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(ids)
    }

    return fetch(`${config.apiUrl}/employees/delete`, request)
    .then(unauthorized);
}

export const employeeService = {
    searchEmployees,
    registerEmployee,
    getParticipants,
    getEmployeesTable,
    insertEmployeeExcel,
    deleteEmployees,
    updateEmployeeData,
    addNewEmployee
}