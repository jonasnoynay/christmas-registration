import { participantConstants } from '../_constants';

const initialState = { participantsTable: [] };

export function participant(state = initialState, action) {
    switch(action.type) {
        case participantConstants.PARTICIPANTSTABLE_REQUEST:
            return {
                participantsTable: []
            }
        case participantConstants.PARTICIPANTSTABLE_SUCCESS:
            return {
                participantsTable: action.participantsTable
            }
        case participantConstants.PARTICIPANTSTABLE_FAILURE:
            return {
                participantsTable: []
            }
        case participantConstants.DELETE_REQUEST:
            return {
                participantsTable: state.participantsTable
            }
        case participantConstants.DELETE_SUCCESS:
            return {
                participantsTable: state.participantsTable
            }
        case participantConstants.DELETE_FAILURE:
            return {
                participantsTable: state.participantsTable
            }
        default:
            return state;
    }
}