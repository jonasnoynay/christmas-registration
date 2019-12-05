import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Typography, Modal, Backdrop, Fade, Zoom } from '@material-ui/core';

import PropTypes from 'prop-types';

const SLOTS_PER_REEL = 12;

const REEL_RADIUS = 200;

let spinPerPie = 0;

var slotAngle = 360 / SLOTS_PER_REEL;

const styles = theme => ({
    root: {
        ...theme.gradientPrimary,
        padding: '0 10px',
        borderRadius: 4,
        minHeight: 50,
        marginTop: -25
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        color: '#ffd3d3',
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 800
    },
    congrats2: {
        color: '#ffffff',
        marginTop: '30px',
        textAlign: 'center',
        fontSize: 42
    },
    congrats3: {
        color: '#ffffff',
        marginBottom: '30px',
        textAlign: 'center',
        fontSize: 80,
        fontWeight: 600
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

    prizeName: {
        fontSize: '1.3vw',
        fontWeight: 800,
        lineHeight: '9',
        verticalAlign: 'middle',
        textAlign: 'right',
        padding: '0 25px',
        color: '#fff',
        paddingLeft: 'calc(100% - 285px)'
    }
});

class SpinningWheel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spin: 0,
            isSpinning: false,
            hasWinner: false,
            winner: {},
            stopped: false,
            spinIdx: 0,
            stoppedAt: 0,
            showConfetti: false
        }

        this.si = null;
        this.ci = null;

        this.spinPointer = React.createRef();
    }

    createConfetti = () => {
        let confettis = [];

        for(let i = 0; i < 150; i++) {
            confettis.push(<div key={'confetti-'+(i+1)} className={'confetti-'+(i+1)}></div>)
        }

        return confettis;
    }

    startConfetti = () => {
        this.setState({
            showConfetti: true
        });
    }

    stopConfetti = () => {
        this.setState({
            showConfetti: false
        });
    }

    start = (idx) => {
        
        this.setState({
            isSpinning: true
        });

        this.si = setInterval(() => {
            this.setState({
                spin: this.state.spin + slotAngle,
            });
        }, 30);
        
        setTimeout(() => {
            this.stop(idx);
        }, 5000);

        setTimeout(() => {
            this.setState({
                isSpinning: false,
                stopped: true
            });
        }, 6000);
    }

    stop = (idx) => {

        clearInterval(this.si);
        const stoppedAt = (((this.state.spin / slotAngle) % SLOTS_PER_REEL) - SLOTS_PER_REEL) * -1;
        const toAdd = ((idx - SLOTS_PER_REEL) * -1) + stoppedAt;     
        
        
        this.setState({
            spin: this.state.spin + (toAdd * slotAngle),
        });

        setTimeout(() => {
            this.setState({
                hasWinner: true,
                winner: this.props.prizelist[idx]
            });
            clearInterval(this.ci);
            this.startConfetti();
        }, 4000);
    }

    handleBackdropClick = () => {
        this.setState({ open: false });
        this.handleClose();
    }

    reset = () => {
        this.setState({
            hasWinner: false,
            stopped: false
        });

        clearInterval(this.si);
        this.si = null;

        //this.props.resetMachine();
    }
    
    render = () => {

        const { classes, prizelist } = this.props;

        const { spinIdx, hasWinner, winner, isSpinning, stopped } = this.state;

        //+' '+ ((spinIdx % SLOTS_PER_REEL) == idx ? 'active' : '')

        return (
            <React.Fragment>
                <div className={'div-spinner'}>
                    <div className={'spinner-rotate'}>
                        <ul className={'spinner-ring '} style={{ transform: `rotateZ(${this.state.spin}deg)` }}>
                            {prizelist.map((prize, idx) =>
                                <li className={'li-pie li-pie-'+idx} key={'pie-'+idx}  style={{ background: prize['bgColor'] }}>
                                    <Typography variant="h5" className={classes.prizeName}>{prize.name}</Typography>
                                </li>
                            )}
                        </ul>
                        {this.props.children}
                        <div className={'spinner-pointer '+(isSpinning ? 'isSpinning' : (stopped ? 'stopped' : ''))} ref={this.spinPointer}></div>
                    </div>
                </div>

                {hasWinner &&
                        <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={hasWinner}
                        className={classes.modal}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        onClick:this.reset
                        }}
                        >
                            <Fade in={this.props.open}>
                            <React.Fragment>
                                {this.state.showConfetti ? (
                                    <div key={'confetticon-1'} className={classes.confettiWrapper}>
                                        {this.createConfetti()}
                                    </div>
                                ) : null}
                                <Zoom key={'zoom-1'} in={hasWinner} timeout={{
                                    appear: 500,
                                    enter: 300,
                                    exit: 500,
                                   }}>
                                <div className={classes.paper}>
                                <div className={classes.winnerDiv} key={'congrats-1'}>
                                        <Typography variant="h4" className={classes.congrats}>CONGRATULATIONS</Typography>
                                        <Typography variant="h4" className={classes.congrats2}>YOU WON</Typography>
                                        <Typography variant="h4" className={classes.congrats3}>{winner.name}</Typography>
                                        <Button variant="contained" key={'button-2'} color="secondary" className={classes.drawStart} onClick={this.reset}>DONE</Button>
                                    </div>
                                </div>
                                </Zoom>
                            </React.Fragment>
                            </Fade>
                        </Modal>
                }
            </React.Fragment>
        )
    }
}

SpinningWheel.propTypes = {
    prizelist: PropTypes.array,
    onDrawEnd: PropTypes.func
}

SpinningWheel.defaultProps = {
    prizelist: [],
}

export default withStyles(styles)(SpinningWheel);