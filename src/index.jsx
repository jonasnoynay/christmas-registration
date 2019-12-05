import React from 'react';
import ReactDOM from 'react-dom';
import './css/main.scss';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import theme from './js/_themes/commons';

import App from './js/App';
import { store } from './js/_helpers';

window.store = store;

ReactDOM.render(
    <ThemeProvider theme={theme}>
            <Provider store={store}>
                <App />
            </Provider>
    </ThemeProvider>,
    
document.getElementById('root'));