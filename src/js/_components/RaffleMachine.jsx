import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';

import PropTypes from 'prop-types';

const SLOTS_PER_REEL = 12;

const REEL_RADIUS = 200;

var slotAngle = 360 / SLOTS_PER_REEL;

const styles = theme => ({
    root: {
        ...theme.gradientPrimary,
        padding: '0 10px',
        borderRadius: 4,
        minHeight: 50,
        marginTop: -25
    },
    drawStart: {
        ...theme.gradientPrimary,
        width: 340,
        textAlign: 'center',
        display: 'block',
        margin: '30px auto 0',
        fontSize: 64,
        height: 110,
        borderRadius: 12,
        color: '#ffffff'
    },

    congrats: {
        color: '#cc3c3c',
        textAlign: 'center'
    },

    congratsName: {
        fontWeight: 800,
        fontSize: 45,
        color: '#ffffd1',
        textAlign: 'center'
    },

    winnerDiv: {
        marginTop: '4em'
    },

    slotName: {
        fontSize: '50px',
        lineHeight: 1
    }
});

class RaffleMachine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spin: 0,
            step: 30,
            isSpinning: false,
            winner: {},
            stopped: false
        }

        this.si = null;
    }

    componentDidMount = () => {
        this.start();

        setTimeout(()=>{
            this.stop();
        }, 6000);
    }

    start = () => {
        
        this.setState({
            isSpinning: true
        });

        this.si = setInterval(() => {
            this.setState({
                spin: this.state.spin - this.state.step
            });
        }, 50);
    }

    stop = () => {
        var winner = Math.floor(Math.random()*(SLOTS_PER_REEL));

        const stoppedAt = (((this.state.spin / slotAngle) * -1) % SLOTS_PER_REEL) + 1;
        const toAdd = (SLOTS_PER_REEL - stoppedAt) + (winner + 1);

        console.log('winner is ', this.props.employees[winner]);
        
        clearInterval(this.si);

        this.setState({
            spin: this.state.spin - (toAdd * slotAngle),
            stopped: true
        });

        setTimeout(() => {
            this.setState({
                isSpinning: false,
                winner: this.props.employees[winner]
            });
            this.props.onDrawEnd(this.props.employees[winner]);
        }, 3000);
    }

    reset = () => {
        this.setState({
            spin: 0,
            step: 30,
            isSpinning: false,
            winner: {},
            stopped: false
        });

        clearInterval(this.si);
        this.si = null;

        this.props.resetMachine();
    }
    
    render = () => {

        const { classes, employees } = this.props;

        return (
            <React.Fragment>
                <div className={'div-box'}>
                    <div className={'div-stage'}>
                        <div className={'div-rotate'}>
                            <ul className={'ul-ring '+ (!this.state.stopped ? 'spinning' : '')} style={{ transform: `rotateX(${this.state.spin}deg)` }}>
                                {employees.map((employee, idx) =>
                                    <li className={'li-slot'} key={'slot-'+idx} style={{ transform:  `rotateX(${(slotAngle * idx)}deg) translateZ(${REEL_RADIUS}px)` }}>
                                        <Typography variant="h5" className={'li-slot-name '+classes.slotName}>{employee.fullname}</Typography>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className={'div-box-overlay'}></div>
                </div>

                {!_.isEmpty(this.state.winner) &&
                        <div className={classes.winnerDiv} key={'congrats-1'}>
                            <Typography variant="h4" className={classes.congrats}>CONGRATULATIONS</Typography>
                            <Typography variant="h4" className={classes.congratsName}>{this.state.winner.fullname}</Typography>
                            <Button variant="contained" key={'button-2'} color="secondary" className={classes.drawStart} onClick={this.reset}>DONE</Button>
                        </div>
                }
            </React.Fragment>
        )
    }
}

RaffleMachine.propTypes = {
    employees: PropTypes.array,
    onDrawEnd: PropTypes.func
}

RaffleMachine.defaultProps = {
    employees: [],
}

export default withStyles(styles)(RaffleMachine);