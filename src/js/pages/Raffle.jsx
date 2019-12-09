import React, { Component } from 'react';
import { appActions, prizeActions, employeeActions } from '../_actions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ItemsCarousel from 'react-items-carousel';
import { Typography, Fab, CircularProgress } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RaffleModal from '../_components/RaffleModal';
import RaffleMachine from '../_components/RaffleMachine';

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
    }
});


class Raffle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfetti: false
        }

        this.raffleMachineEl = React.createRef();
        this.raffleModalEl = React.createRef();
    }

    componentWillMount = () => {
        const { dispatch } = this.props;
        dispatch(appActions.setSiteTitle('Raffle'));
    }

    componentDidMount = () => {
        //this.props.dispatch(prizeActions.getPrizes());
    }

    handleBackdropClick = () => {
        this.setState({ open: false });
        this.handleClose();
    }

    handleClose = () => {
        this.stopConfetti();
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
        }, ()=> {
            this.props.dispatch(employeeActions.resetParticipants());
        });
    }

    handleDrawEnd = (winner) => {
        this.startConfetti();
    }

    play = () => {
        this.props.dispatch(employeeActions.getParticipants());
        setTimeout(()=>{
            this.setState({ open: true });
        }, 1500);
    }

    createPrizes = () => {
        const prizeElements = [];
        const { classes, prizes } = this.props;

        _.forEach(prizes, (category, i) => {
            if(category.prizes && category.prizes.data) {
                _.forEach(category.prizes.data, (prize, idx) => {
                    prizeElements.push(
                        <div className={'grid-raffle__item '+ ( prize.attributes.level == 2 ? 'grand-draw' : '')} key={'prize-'+idx}>
                            <Typography className={classes.header} variant="h4">{prize.attributes.level == 2 ? 'Grand Draw' : category.name}</Typography>
                            <div className={'grid-raffle__img'}>
                                
                            </div>
                            <Typography className={classes.prizeName} variant="h5">{prize.attributes.name}</Typography>
                            {
                                prize.attributes.winner ? (
                                    <React.Fragment>
                                        <Typography variant="h5" className={classes.winnerText}>WINNER</Typography>
                                        <Typography variant="h5" className={classes.winnerName}>{prize.attributes.winner.attributes.firstname} {prize.attributes.winner.attributes.lastname}</Typography>
                                    </React.Fragment>
                                ) 
                                : (<Fab variant="extended" className={classes.fab} onClick={()=> { this.play(prize) }}>PLAY</Fab>)
                            }
                        </div>
                    );
                });
            }
        });

        return prizeElements;
    }
    

    render = () => {
        
        const { classes, prizes, participants } = this.props;

        return (
            <React.Fragment>
                {this.state.showConfetti ? (
                    <div key={'confetticon-1'} className={classes.confettiWrapper}>
                        {this.createConfetti()}
                    </div>
                ) : null}
                <div className={'grid-raffle__container'}>
                    <div className={'grid-raffle__container-inner'}>
                        <div className={'header-title header-sub'}></div>
                            <div className={'raffle-container'}>
                                    {participants.length > 0 ? (
                                    <RaffleMachine resetMachine={this.handleClose} onDrawEnd={this.handleDrawEnd} key={'machine-1'} employees={participants}></RaffleMachine>
                                ) : (
                                    <Fab variant="extended" className={'play-button'} onClick={()=> { this.play() }}>DRAW</Fab>
                                )}
                            </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    const { prizes } = state.prize;
    const { participants } = state.employee;

    return {
        prizes,
        participants
    }
}

export default Base(connect(mapStateToProps)(withStyles(styles)(Raffle)));