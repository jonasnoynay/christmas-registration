import React, { Component } from 'react';

export default function(Page) {
    class Base extends Component {
        constructor(props) {
            super(props);
        }

        render = () => {

            return (
                <React.Fragment>
                    <div className={'bg-container'}></div>
                    <div className={'brightlights-container'}>
                        <div className={'brightlights-point brightlights-point__1'}></div>
                        <div className={'brightlights-point brightlights-point__2'}></div>
                        <div className={'brightlights-point brightlights-point__3'}></div>
                        <div className={'brightlights-point brightlights-point__4'}></div>
                        <div className={'brightlights-point brightlights-point__5'}></div>
                    </div>
                    <div className={'base-container'}>
                        <Page />
                    </div>
                </React.Fragment>
            )
        }
    }

    return Base;
}