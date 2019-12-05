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

const list = [
    { name: '? ? ?', id: 1 },
    { name: 'Sakuranomiya Maika', id: 2 },
    { name: 'Hinata Kaho', id: 3 },
    { name: 'Hoshikawa Mahuyu', id: 4 },
    { name: 'Amano Miu', id: 5 },
    { name: 'Kanzaki Hideri', id: 6 },
    { name: 'Dino', id: 7 },
    { name: 'Imo Mama', id: 8 },
    { name: 'Japan', id: 9 },
    { name: 'Arats Na', id: 10 },
    { name: 'Mia Khalifa', id: 11 },
    { name: 'Dodong', id: 12 },
  ];

const styles = theme => ({
    header: {
        color: '#ffffff',
        textAlign: 'center'
    },
    prizeName: {
        color: '#ffffff',
        textAlign: 'center'
    },
    fab: {
        ...theme.gradientPrimaryButton,
        width: 210,
        textAlign: 'center',
        display: 'block',
        margin: '12px auto 0',
        fontSize: 38,
        height: 60
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
    }
});


class Raffle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employee_id: null,
            activeItemIndex: 0,
            open: false,
            value: '',
            target: 1,
            times: 1,
            duration: 3000,
            prizeToPlay: null,
        }

        this.raffleMachineEl = React.createRef();
        this.raffleModalEl = React.createRef();
    }

    componentWillMount = () => {
        const { dispatch } = this.props;
        dispatch(appActions.setSiteTitle('Raffle'));
    }

    componentDidMount = () => {
        this.props.dispatch(prizeActions.getPrizes());
    }

    handleBackdropClick = () => {
        this.setState({ open: false });
        this.handleClose();
    }

    handleClose = () => {
        this.raffleMachineEl.current.reset();
        this.raffleModalEl.current.stopConfetti();
    }

    handleDrawEnd = (winner) => {
        this.raffleModalEl.current.startConfetti();

        this.props.dispatch(prizeActions.participantWin(this.state.prizeToPlay.id, winner._id)).then(()=>{
            this.setState({
                prizeToPlay: null
            });

            this.props.dispatch(prizeActions.getPrizes());
        });
    }

    play = (prizeToPlay) => {
        this.props.dispatch(employeeActions.getParticipants());
        this.setState({ open: true, prizeToPlay });

        console.log('prizeToPlay', prizeToPlay);
    }

    setActiveItemIndex = ( activeItemIndex ) => {
        this.setState({ activeItemIndex })
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
            <div className={'grid-raffle__container'}>
                <div className={'grid-raffle__container-inner'}>
                    <div className={'header-title header-sub'}></div>
                        <div className={'raffle-container'}>
                            {prizes.length > 0 ? 
                                    (
                                        <ItemsCarousel
                                            requestToChangeActive={this.setActiveItemIndex}
                                            activeItemIndex={this.state.activeItemIndex}
                                            activePosition={'center'}
                                            numberOfCards={1}
                                            gutter={50}
                                            leftChevron={<ChevronLeftIcon style={{fontSize: 100}} />}
                                            rightChevron={<ChevronRightIcon style={{fontSize: 100}} />}
                                            chevronWidth={40}
                                            className={classes.itemCarousel}
                                        >
                                            {this.createPrizes()}
                                        </ItemsCarousel>
                                    ) : (
                                        <CircularProgress className={classes.prizeLoader} size={100} color="secondary" />
                                    )
                            }
                        </div>
                </div>
                <RaffleModal
                    open={this.state.open}
                    onBackdropClick={this.handleBackdropClick}
                    onClose={this.handleClose}
                    ref={this.raffleModalEl}
                >
                    {participants.length > 0 ? (
                        <RaffleMachine ref={this.raffleMachineEl} onDrawEnd={this.handleDrawEnd} key={'machine-1'} employees={participants}></RaffleMachine>
                    ) : (
                        <CircularProgress className={classes.raffleLoader} size={65} color="secondary" />
                    )
                    }
                    
                </RaffleModal>
            </div>
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