import { prizeConstants } from '../_constants';

const initialState = { prizes: [], win : null, prizesTable: [] };

export function prize(state = initialState, action) {
    switch(action.type) {
        case prizeConstants.FETCH_REQUEST:
            return {
                prizes: [],
                win: state.win,
                prizesTable: state.prizesTable
            }
        case prizeConstants.FETCH_SUCCESS:
            return {
                prizes: action.prizes,
                win: state.win,
                prizesTable: state.prizesTable
            }
        case prizeConstants.FETCH_FAILURE:
            return {
                prizes: [],
                win: state.win,
                prizesTable: state.prizesTable
            }
        case prizeConstants.WIN_REQUEST:
            return {
                prizes: state.prizes,
                win: null,
                prizesTable: state.prizesTable
            }
        case prizeConstants.WIN_SUCCESS:
            return {
                prizes: state.prizes,
                win: action.win,
                prizesTable: state.prizesTable
            }
        case prizeConstants.WIN_FAILURE:
            return {
                prizes: state.prizes,
                win: null,
                prizesTable: state.prizesTable
            }
        case prizeConstants.TABLE_REQUEST:
            return {
                prizes: state.prizes,
                win: null,
                prizesTable: []
            }
        case prizeConstants.TABLE_SUCCESS:
            return {
                prizes: state.prizes,
                win: action.win,
                prizesTable: state.prizesTable
            }
        case prizeConstants.TABLE_FAILURE:
            return {
                prizes: state.prizes,
                win: null,
                prizesTable: []
            }
        default:
            return state;
    }
}