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
        padding: theme.spacing(4, 4, 4),
        width: '100%',
        maxWidth: 650,
        textAlign: 'center'
      },
      progress: {
        margin: theme.spacing(2),
      },
      titleText: {
        marginBottom: 30
      },
      tapText: {
        color: '#000000',
        fontWeight: '800',
        fontSize: 30
      }
});

class MaterialModal extends Component {
    constructor(props) {
        super(props);

    }

    handleOpen = () => {
        //this.setState({ open: true });
      };
    
    handleClose = () => {
        //this.props.open = f
    };
    
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
            onClick={onBackdropClick}
            BackdropProps={{
            timeout: 500,
            onClick:onBackdropClick
            }}
            >
                <Fade in={this.props.open}>
                <React.Fragment>
                {!loaded && 
                    <CircularProgress className={classes.progress} color="secondary" />
                }
                
                {loaded && 
                    <Zoom in={this.props.open} timeout={{
                        appear: 500,
                        enter: 300,
                        exit: 500,
                       }}>
                    <div className={classes.paper}>
                        <Typography variant="h3" className={classes.titleText}>{this.props.title}</Typography>
                        <Typography variant="h5" className={classes.tapText}>Tap anywhere to close</Typography>
                        { this.props.children }
                    </div>
                    </Zoom>
                }
                </React.Fragment>
                </Fade>
            </Modal>
        )
    }
}

MaterialModal.propTypes = {
    id: PropTypes.string,
    handleOpen: PropTypes.func,
    handleClose: PropTypes.func,
    onBackdropClick: PropTypes.func,
}

MaterialModal.defaultProps = {
    id: 'material_modal',
}

export default withStyles(styles)(MaterialModal);