import React, { Component } from 'react';

import { AppBar, Toolbar, Typography, CssBaseline } from '@material-ui/core';
import { withStyles, createMuiTheme  } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const styles = theme => ({
    link: {
        color: '#ffffff',
        margin: '0 10px'
    },
    linkMenu: {
        margin: '0 30px'
    }
});

export default function(Page) {
    class CMS extends Component {
        constructor(props) {
            super(props);
        }

        render = () => {

            const { classes } = this.props;

            return (
                <React.Fragment>
                    <CssBaseline />
                    <AppBar position="relative">
                        <Toolbar>
                            <Typography variant="h6">
                                ADMIN
                            </Typography>
                            <div className={classes.linkMenu}>
                                <Link to="/manage-registration" className={classes.link}>
                                    Manage Registration
                                </Link>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className={'base-container'}>
                        <Page />
                    </div>
                </React.Fragment>
            )
        }
    }

    return (withStyles(styles)(CMS));
}