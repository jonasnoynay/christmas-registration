import { appConstants } from '../_constants';
import { globals } from '../globals';

const runAction = (actionType, value) => {return { type: actionType,  ...value} };

const setHeaderTitle = (headerTitle) => {
    return dispatch => {
        dispatch(runAction( appConstants.HEADER_TITLE_SET, { headerTitle } ));
    }
}

const setSiteTitle = (title) => {
    document.title = `${title} - ${globals.siteTitle}`;
    return { type: appConstants.SITE_TITLE_SET };
}

export const appActions = {
    setHeaderTitle,
    setSiteTitle
}