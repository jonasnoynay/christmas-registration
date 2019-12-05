import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from './_helpers';

import RegisterForm from './pages/RegisterForm';
import ManageRegistration from './pages/ManageRegistration';
import Raffle from './pages/Raffle';
import Spin from './pages/Spin';
import ManageSpin from './pages/ManageSpin';

class App extends Component {

    render = () => {
        return (
            <React.Fragment>
                <Router history={history}>
                        <Switch>
                            <Route exact path='/' component={RegisterForm} />
                            <Route path='/raffle' component={Raffle} />
                            <Route path='/spin' component={Spin} />
                            <Route path='/manage-registration' component={ManageRegistration} />
                        </Switch>
                </Router>
            </React.Fragment>
        );
    }
}

export default App;