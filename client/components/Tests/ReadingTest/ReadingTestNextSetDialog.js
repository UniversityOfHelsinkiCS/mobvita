import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { FormattedMessage, useIntl } from 'react-intl';
import useWindowDimensions from 'Utilities/windowDimensions';
import AppButton from 'Components/AppButton';


// Draggable prompt to confirm moving on to the next reading-test set.
const ReadingTestNextSetDialog = ({ showNextSetDialog, confirmNextSet }) => {
    // react-draggable needs a ref to the dragged node (React 19 removed findDOMNode).
    const dragRef = useRef(null)
    const bigScreen = useWindowDimensions().width >= 700;

    // Draggable card with the next-set message and confirm button.
    const renderNextSetDialog = () => (
        <Draggable nodeRef={dragRef} cancel=".interactable">
            <div
                ref={dragRef}
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
                            <FormattedHTMLMessage
                                id='move-to-next-set-of-reading-items'
                                // values={{
                                //     b: (chunks) => <b>{chunks}</b>,
                                //     i: (chunks) => <i>{chunks}</i>,
                                //     // br: () => <br />,
                                //     ul: (chunks) => <ul>{chunks}</ul>,
                                //     li: (chunks) => <li>{chunks}</li>
                                // }}
                            />
                        </h4>
                        <AppButton
                            variant="primary"
                            onClick={confirmNextSet}
                            style={{
                                margin: "5px",
                                // width: "100%",
                                padding: "10px"
                            }}
                        >
                            <FormattedMessage id='confirm-next-set' />
                        </AppButton>
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
