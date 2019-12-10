import { participantConstants } from '../_constants';
import { participantService } from '../_services';
import { __parse } from '../_helpers';

const runAction = (actionType, value) => {return { type: actionType,  ...value} };

const getParticipantsTable = filters => {
    return async dispatch => {
        dispatch(runAction( participantConstants.PARTICIPANTSTABLE_REQUEST ));
        try {
            const participantsTable = await participantService.getParticipantsTable(filters).then(response => __parse(response));
            dispatch(runAction( participantConstants.PARTICIPANTSTABLE_SUCCESS, { participantsTable } ));
            return participantsTable;

        } catch (error) {
            dispatch(runAction( participantConstants.PARTICIPANTSTABLE_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const insertParticipantExcel = data => {
    return async dispatch => {
        dispatch(runAction( participantConstants.INSERTEXCEL_REQUEST ));
        try {
            const participantsTable = await participantService.insertParticipantExcel({data}).then(response => __parse(response));
            dispatch(runAction( participantConstants.INSERTEXCEL_SUCCESS, { participantsTable } ));
            return Promise.resolve(participantsTable);

        } catch (error) {
            dispatch(runAction( participantConstants.INSERTEXCEL_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const addNewParticipant = data => {
    return async dispatch => {
        dispatch(runAction( participantConstants.NEW_REQUEST ));
        try {
            const success = await participantService.addNewParticipant(data).then(response => __parse(response));
            dispatch(runAction( participantConstants.NEW_SUCCESS, { success } ));
            return Promise.resolve(success);

        } catch (error) {
            dispatch(runAction( participantConstants.NEW_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const deleteParticipants = ids => {
    return async dispatch => {
        dispatch(runAction( participantConstants.DELETE_REQUEST ));
        try {
            const participantsTable = await participantService.deleteParticipants({ids}).then(response => __parse(response));
            dispatch(runAction( participantConstants.DELETE_SUCCESS, { participantsTable } ));
            return Promise.resolve(participantsTable);

        } catch (error) {
            dispatch(runAction( participantConstants.DELETE_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

export const participantActions = {
    getParticipantsTable,
    insertParticipantExcel,
    deleteParticipants,
    addNewParticipant
}