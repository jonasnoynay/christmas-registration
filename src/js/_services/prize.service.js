import config from 'config';
import { unauthorized, fetchEncode } from '../_helpers';

const getPrizes = async () => {
    const request = {
        method: 'GET',
        headers: {'Content-Type' : 'application/json'}
    }

    return fetch(`${config.apiUrl}/prizes`, request)
    .then(unauthorized);
}
const getPrizeJson = async () => {
    const request = {
        method: 'GET',
        headers: {'Content-Type' : 'application/json'}
    }

    return fetch(`${config.apiUrl}/prizes`, request)
    .then(unauthorized);
}

const getPrizesTable = async filters => {
    const request = {
        method: 'GET',
        headers: {'Content-Type' : 'application/json'}
    }

    return fetch(`${config.apiUrl}/prizes/table?${fetchEncode(filters)}`, request)
    .then(unauthorized);
}

const participantWin = async (prize_id, employee_id) => {
    const request = {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({prize_id, employee_id})
    }

    return fetch(`${config.apiUrl}/participant/win`, request)
    .then(unauthorized);
}

export const prizeService = {
    getPrizes,
    participantWin,
    getPrizesTable,
    getPrizeJson
}