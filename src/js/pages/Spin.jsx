import React, { Component } from 'react';
import { appActions, prizeActions, employeeActions } from '../_actions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ItemsCarousel from 'react-items-carousel';
import { Typography, Fab, CircularProgress } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RaffleModal from '../_components/RaffleModal';
import SpinningWheel from '../_components/SpinningWheel';

import Base from './Base';

const styles = theme => ({
    header: {
        color: '#ffffff',
        textAlign: 'center'
    },
    prizeName: {
        color: '#ffffff',
        textAlign: 'center'
    },
    itemCarousel: {
        maxWidth: 800
    },
    rouletteContainer: {
        height: 59,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '24px'
    },
    refContainer: {
        height: 59,
        overflow: 'hidden'
    },
    carouselItem: {
        display: 'block',
        width:'100%',
        margin: 'auto',
        background: '#fff',
        color: '#000',
        padding: '10px 20px'
    },
    winnerText: {
        color: '#d4d45d',
        textAlign: 'center',
        fontWeight: 800,
        marginTop: 22
    },
    winnerName: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 800
    },
    prizeLoader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        margin: 'calc(-75px / 2) 0px 0px calc(-75px / 2)'
    },
    raffleLoader: {
        margin: '50px 0 50px'
    },
    confettiWrapper: {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'fixed',
        zIndex: 1000,
        pointerEvents: 'none'
    },

    playButton: {
        width: '23%',
        height: 0,
        padding: '0 0 23% 0',
        borderRadius: '50%',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#eeefd0',
        zIndex: 2
    },

    playButtonLabel: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%) scaleX(0.5)',
        fontSize: '5.2vw',
        fontWeight: 600,
        color: '#af3030'
    }
});


class Spin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfetti: false,
            toWin: false
        }

        this.spiningWheelEl = React.createRef();
    }

    componentWillMount = () => {
        const { dispatch } = this.props;
        dispatch(appActions.setSiteTitle('Spin A Wheel'));
    }

    componentDidMount = () => {
        this.props.dispatch(prizeActions.getPrizeJson());
    }

    handleClose = () => {
        this.stopConfetti();
    }

    handleDrawEnd = (winner) => {
        console.log(winner);
    }

    play = () => {

        const winningList = [];
        const { prizes } = this.props;

        prizes.forEach( (prize, idx) => { 
            if(prize.quantity > 0) { 
                for(var i=0;i<prize.quantity;i++) { 
                    winningList.push(idx) 
                }   
            }  
        });

        let quantityIdx = Math.floor(Math.random()*(winningList.length));

        let removeFromWin = winningList.splice(quantityIdx, 1);
        
        if(removeFromWin.length == 0) return alert('No more prizes');

        this.spiningWheelEl.current.start(removeFromWin);

        //this.setState({ toWin: idx });

        // this.props.dispatch(employeeActions.getParticipants());
        // setTimeout(()=>{
        //     this.setState({ open: true });
        // }, 1500);
    }
    

    render = () => {
        
        const { classes, prizes } = this.props;

        return (
            <div className={'raffle-main-container'}>
                <div className={'grid-raffle__container'}>
                    <div className={'grid-raffle__container-inner'}>
                        <div className={'header-title header-sub'}></div>
                            <div className={'raffle-container'}>
                                    {prizes.length > 0 &&
                                        <SpinningWheel ref={this.spiningWheelEl} resetMachine={this.handleClose} onDrawEnd={this.handleDrawEnd} key={'spin-1'} prizelist={prizes}>
                                            <Fab variant="extended" classes={{ root: classes.playButton, label: classes.playButtonLabel }} onClick={()=> { this.play() }}>SPIN</Fab>
                                        </SpinningWheel>
                                    }
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { prizes } = state.prize;
    return {
        prizes
    }
}

export default Base(connect(mapStateToProps)(withStyles(styles)(Spin)));