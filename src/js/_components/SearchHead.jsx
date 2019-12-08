import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import PropTypes from 'prop-types';

import {
    MenuItem,
    Paper
} from '@material-ui/core';

import {
    Close
} from '@material-ui/icons';

const styles = theme => ({
    root: {
        color: '#000000',
        background: '#ffffff',
        padding: '0 10px',
        borderRadius: 4,
        minHeight: 50,
        marginTop: -25
    },
    searchText: {
        float: 'left',
        fontSize: 22,
        fontFamily: 'Venera',
        color: '#000000',
        background: 'none',
        border: '0',
        outline: 'none',
        padding: '0.5em',
        '&::placeholder': {
            color: '#000000'
        }
    },
    container: {
        position: 'relative',
      },
      suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: '-7px',
        right: 0,
        top: 42,
        width: 'calc(100% + 15px)',
        background: 'rgba(255, 255, 255, 0.82)'
      },
      suggestion: {
        display: 'block',
      },
      suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
      },
      rightDiv: {
         float: 'right',
      },
      icon: {
          color: '#ffffff',
          fontSize: 40,
          margin: '4.5px 4px 0 0',
          cursor: 'pointer'
      },
      item: {
          fontSize: 24,
      }
});

function renderInputComponent(inputProps) {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;
  
    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
        }}
        {...other}
      />
    );
  }

class SearchHead extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            fetching: false
        }
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        
    }

    onSuggestionSelected = () => {

    }

    clearInput = e => {
        this.setState({ value: '' });
    }

    handleSuggestionsClearRequested = () => {
        
    }

    getSuggestionValue = (suggestion) => {
        return `${suggestion.fullname}`;
    }

    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        let text = `${suggestion.id_number}: ${suggestion.fullname}`;
        const matches = match(text, query);
        const parts = parse(text, matches);

        const { classes } = this.props;

        return (
            <MenuItem selected={isHighlighted} component="div" className={classes.item}>
            <div>
                {parts.map(part => (
                <span key={part.text} style={{ fontWeight: part.highlight ? 800 : 400 }}>
                    {part.text}
                </span>
                ))}
            </div>
            </MenuItem>
        );
    }

    handleChange = (e, { newValue }) => {
        this.setState({
            value: newValue
        })
    }
    
    render = () => {

        const {
            classes,
            placeholder,
            id,
            width,
            onSuggestionsFetchRequested,
            suggestions,
            onSuggestionSelected,
            onCloseInput,
            helpers } = this.props;

        return (
            <div className={classes.root}>
                <Autosuggest
                    {...renderInputComponent}
                    inputProps={{
                        placeholder,
                        className: classes.searchText,
                        id,
                        value: this.state.value,
                        onChange: this.handleChange,
                        style: { width }
                    }}
                    theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                    renderSuggestionsContainer={options => (
                        <Paper {...options.containerProps} square>
                          {options.children}
                        </Paper>
                      )}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={(e, v)=>{
                        onSuggestionsFetchRequested(e, v);
                        this.handleSuggestionsFetchRequested(e, v);
                    }}
                    onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    onSuggestionSelected={onSuggestionSelected}
                    highlightFirstSuggestion={true}
                />
                {this.state.value &&
                    <div className={classes.rightDiv}>
                    {helpers({ classIcon: classes.icon })||null}
                    <Close className={classes.icon} key={'close_search'} onClick={()=> {
                        this.clearInput();
                        if(onCloseInput) onCloseInput();
                    }}/>
                </div>
                }
            </div>
        )
    }
}

SearchHead.propTypes = {
    id: PropTypes.string,
    placeholder: PropTypes.string,
    onSuggestionsFetchRequested: PropTypes.func,
    suggestions: PropTypes.array,
    onSuggestionSelected: PropTypes.func,
    handleClose: PropTypes.func,
    helpers: PropTypes.func
}

SearchHead.defaultProps = {
    placeholder: 'Search...',
    id: 'search_text',
    width: 'calc(100% - 66px)',
    suggestions: [],
}

export default withStyles(styles)(SearchHead);