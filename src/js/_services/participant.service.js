import config from 'config';
import { unauthorized, fetchEncode } from '../_helpers';

const getParticipantsTable = async filters => {
    const request = {
        method: 'GET',
        headers: {'Content-Type' : 'application/json'}
    }

    return fetch(`${config.apiUrl}/participants/table?${fetchEncode(filters)}`, request)
    .then(unauthorized);
}

const insertParticipantExcel = async data => {
    const request = {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
    }

    return fetch(`${config.apiUrl}/participants/excel/insert`, request)
    .then(unauthorized);
}

const deleteParticipants = async ids => {
    const request = {
        method: 'DELETE',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(ids)
    }

    return fetch(`${config.apiUrl}/participants/delete`, request)
    .then(unauthorized);
}

export const participantService = {
    getParticipantsTable,
    insertParticipantExcel,
    deleteParticipants
}

