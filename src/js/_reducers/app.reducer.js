
import { appConstants } from '../_constants';

const initialState = { headerTitle: '' };

export function app(state = initialState, action) {
    switch(action.type) {
        case appConstants.HEADER_TITLE_SET:
            return {
                headerTitle: action.headerTitle
            }
        default:
            return state;
    }
}