import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Modal, Backdrop, Fade, Zoom, CircularProgress, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
        ...theme.gradientPrimary,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(3, 3, 3),
        width: 800,
        textAlign: 'center'
      },
      progress: {
        margin: theme.spacing(2),
      },
      confettiWrapper: {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute',
        zIndex: 1000,
        pointerEvents: 'none'
      }
});

class RaffleModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfetti: false
        }
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


    
    render = () => {

        const { classes, loaded, onBackdropClick } = this.props;

        return (
            <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.props.open}
            onClose={this.props.onClose}
            className={classes.modal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            onClick:onBackdropClick
            }}
            >
                <Fade in={this.props.open}>
                <React.Fragment>
                    {this.state.showConfetti ? (
                        <div key={'confetticon-1'} className={classes.confettiWrapper}>
                            {this.createConfetti()}
                        </div>
                    ) : null}
                    <Zoom key={'zoom-1'} in={this.props.open} timeout={{
                        appear: 500,
                        enter: 300,
                        exit: 500,
                       }}>
                    <div className={classes.paper}>
                        { this.props.children }
                    </div>
                    </Zoom>
                </React.Fragment>
                </Fade>
            </Modal>
        )
    }
}

RaffleModal.propTypes = {
    id: PropTypes.string,
    handleOpen: PropTypes.func,
    handleClose: PropTypes.func,
    onBackdropClick: PropTypes.func,
}

RaffleModal.defaultProps = {
}

export default withStyles(styles)(RaffleModal);