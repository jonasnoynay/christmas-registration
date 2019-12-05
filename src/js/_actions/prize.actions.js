import { prizeConstants } from '../_constants';
import { prizeService } from '../_services';
import { __parse } from '../_helpers';

const runAction = (actionType, value) => {return { type: actionType,  ...value} };

const getPrizes = () => {
    return async dispatch => {
        dispatch(runAction( prizeConstants.FETCH_REQUEST ));
        try {
            const prizes = await prizeService.getPrizes().then(response => __parse(response));
            dispatch(runAction( prizeConstants.FETCH_SUCCESS, { prizes } ));
            return Promise.resolve(prizes);

        } catch (error) {
            dispatch(runAction( prizeConstants.FETCH_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const getPrizeJson = () => {
    return async dispatch => {
        dispatch(runAction( prizeConstants.FETCH_REQUEST ));
        try {
            const prizes = await prizeService.getPrizeJson().then(response => response);
            dispatch(runAction( prizeConstants.FETCH_SUCCESS, { prizes } ));
            return Promise.resolve(prizes);

        } catch (error) {
            dispatch(runAction( prizeConstants.FETCH_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const getPrizesTable = filters => {
    return async dispatch => {
        dispatch(runAction( prizeConstants.TABLE_REQUEST ));
        try {
            const prizes = await prizeService.getPrizesTable(filters).then(response => __parse(response));
            dispatch(runAction( prizeConstants.TABLE_SUCCESS, { prizes } ));
            return Promise.resolve(prizes);

        } catch (error) {
            dispatch(runAction( prizeConstants.TABLE_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

const participantWin = (prize_id, employee_id) => {
    return async dispatch => {
        dispatch(runAction( prizeConstants.WIN_REQUEST, { prize_id, employee_id } ));
        try {
            const win = await prizeService.participantWin(prize_id, employee_id).then(response => __parse(response));
            dispatch(runAction( prizeConstants.WIN_SUCCESS, { win } ));
            return Promise.resolve(win);

        } catch (error) {
            dispatch(runAction( prizeConstants.WIN_FAILURE, { error } ));
            return Promise.reject(error);
        }
    }
}

export const prizeActions = {
    getPrizes,
    participantWin,
    getPrizesTable,
    getPrizeJson
}