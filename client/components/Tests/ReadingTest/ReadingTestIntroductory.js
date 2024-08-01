import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { sanitizeHtml } from 'Utilities/common';
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions';



const DDLangIntroductory = ({ setShowDDLangIntroductory }) => {

    const bigScreen = useWindowDimensions().width >= 700;

    const renderIntroductory = () => (
        <Draggable cancel=".interactable">
            <div
                style={{
                    position: 'absolute',
                    top: '40%',
                    left: bigScreen ? "20%" : "0%",
                    width: bigScreen ? "60%" : "100%",
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    padding: "1em",
                    background: "white",
                    borderRadius: "1em",
                    boxShadow: '6px 11px 10px 0px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>{"introductory_for_ddlang"}</div>
                    <Icon name='close' style={{ cursor: 'pointer' }} onClick={() => setShowDDLangIntroductory(false)} />
                </div>
            </div>
        </Draggable>
    );

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            {renderIntroductory()}
        </div>
    );
};

export default DDLangIntroductory;
