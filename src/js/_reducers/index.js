import { combineReducers } from 'redux';

import { app } from './app.reducer';
import { employee } from './employee.reducer';
import { prize } from './prize.reducer';
import { participant } from './participant.reducer';

const rootReducer = combineReducers({
    app,
    employee,
    prize,
    participant
});

export default rootReducer;