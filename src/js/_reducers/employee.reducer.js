import { employeeConstants } from '../_constants';

const initialState = { employees: [], registeredEmployee: null, participants: [], employeesTable: [] };

export function employee(state = initialState, action) {
    switch(action.type) {
        case employeeConstants.SEARCH_REQUEST:
            return {
                employees: [],
                registeredEmployee: state.registeredEmployee,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
        case employeeConstants.SEARCH_SUCCESS:
            return {
                employees: action.employees.data,
                registeredEmployee: state.registeredEmployee,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
        case employeeConstants.SEARCH_FAILURE:
            return {
                employees: [],
                registeredEmployee: state.registeredEmployee,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
        case employeeConstants.REGISTER_REQUEST:
            return {
                employees: state.employees,
                registeredEmployee: null,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
        case employeeConstants.REGISTER_CLOSE:
            return {
                employees: [],
                registeredEmployee: null,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
        case employeeConstants.REGISTER_SUCCESS:
            return {
                employees: state.employees,
                registeredEmployee: action.employee,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
        case employeeConstants.REGISTER_FAILURE:
            return {
                employees: state.employees,
                registeredEmployee: null,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
        case employeeConstants.PARTICIPANTS_REQUEST:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: [],
                employeesTable: state.employeesTable
            }
        case employeeConstants.PARTICIPANTS_SUCCESS:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: action.participants.data,
                employeesTable: state.employeesTable
            }
        case employeeConstants.PARTICIPANTS_FAILURE:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: [],
                employeesTable: state.employeesTable
            }
        case employeeConstants.PARTICIPANTS_RESET:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: [],
                employeesTable: state.employeesTable
            }
        case employeeConstants.EMPLOYEESTABLE_REQUEST:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: state.participants,
                employeesTable: [],
            }
        case employeeConstants.EMPLOYEESTABLE_SUCCESS:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: state.participants,
                employeesTable: action.employeesTable,
            }
        case employeeConstants.EMPLOYEESTABLE_FAILURE:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: state.participants,
                employeesTable: [],
            }
        case employeeConstants.INSERTEXCEL_REQUEST:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
        case employeeConstants.INSERTEXCEL_SUCCESS:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
        case employeeConstants.INSERTEXCEL_FAILURE:
            return {
                employees: state.employees,
                registeredEmployee: state.registeredEmployee,
                participants: state.participants,
                employeesTable: state.employeesTable
            }
            
        default:
            return state;
    }
}