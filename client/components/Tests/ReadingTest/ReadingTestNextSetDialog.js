import React from 'react';
import Draggable from 'react-draggable';
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions';


const ReadingTestNextSetDialog = ({ showNextSetDialog, confirmNextSet }) => {
    const bigScreen = useWindowDimensions().width >= 700;

    const renderNextSetDialog = () => (
        <Draggable cancel=".interactable">
            <div
                style={{
                    position: 'absolute',
                    left: '0%',
                    width: bigScreen ? "100%" : "100%",
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    padding: "1em",
                    background: "white",
                    borderRadius: "1em",
                    boxShadow: '6px 11px 10px 0px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div className='content-container' style={
                    {
                        overflowY: 'hidden',
                        overflowX: 'hidden',
                        paddingLeft: '1em',
                        paddingRight: '1em',
                        width: '100%'
                    }
                }>
                    <div
                        className='slide-container'
                        style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            margin: "10px"
                        }}
                    >
                        <h4 style={{ textAlign: 'left', margin: 0 }}>
                            <FormattedMessage
                                id='move-to-next-set-of-reading-items'
                                values={{
                                    b: (chunks) => <b>{chunks}</b>,
                                    i: (chunks) => <i>{chunks}</i>,
                                    br: () => <br />,
                                }} />
                        </h4>
                        <button
                            type="confirm"
                            className="btn btn-primary"
                            onClick={confirmNextSet}
                            style={{
                                margin: "5px",
                                // width: "100%",
                                padding: "10px"
                            }}
                        >
                            <FormattedMessage id='confirm-next-set' />
                        </button>
                    </div>
                </div>
            </div>
        </Draggable>
    );

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            {showNextSetDialog && renderNextSetDialog()}
        </div>
    );
};

export default ReadingTestNextSetDialog;
