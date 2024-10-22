import Draggable from 'react-draggable';
import { Icon } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions';

import { getGroups } from 'Utilities/redux/groupsReducer'

const DDLangIntroductory = ({ setShowDDLangIntroductory }) => {
    const intl = useIntl();
    const dispatch = useDispatch()

    const bigScreen = useWindowDimensions().width >= 700;
    const { groups } = useSelector(({ groups }) => groups);

    const [introductoryTextHtml, setIntroductoryTextHtml] = useState('');

    useEffect(() => {
        dispatch(getGroups()); 
    }, []);

    useEffect(() => {
        let experimental = groups.some(group => group.group_type === 'experimental');
        let control = groups.some(group => group.group_type === 'control');
    
        if (control) experimental = false; 
    
        if (experimental) {
            setIntroductoryTextHtml(intl.formatMessage({ id: 'ddlang-introductory-text-experimental' }));
        } else if (control) {
            setIntroductoryTextHtml(intl.formatMessage({ id: 'ddlang-introductory-text-control' }));
        }
    }, [groups]);

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
                    <div
                        className="interactable"
                        dangerouslySetInnerHTML={{ __html: introductoryTextHtml }}
                    />
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
