import { FormattedMessage } from 'react-intl'
import { localeOptions } from 'Utilities/common'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Dropdown, Container } from 'semantic-ui-react'
import { Button } from 'react-bootstrap';

import { setLocale } from 'Utilities/redux/localeReducer'
import { updateLocale } from 'Utilities/redux/userReducer'

const InterfaceLanguageView = ({ setShowLangModal, showInterfaceModal }) => {
    const dispatch = useDispatch()

    const { data } = useSelector(({ user }) => user)
    const { user } = data

    const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])
    const [language, setLanguage] = useState(user?.user?.interfaceLanguage || 'en')

    useEffect(() => {
        const temp = localeOptions.map(option => ({
            value: option.code,
            text: option.displayName,
            key: option.code,
        }))
        setLocaleDropdownOptions(temp)
    }, [dispatch, user])

    const handleLocaleChange = () => {
        dispatch(setLocale(language))
        if (user) dispatch(updateLocale(language))
        setShowLangModal(false)
    }

    return (
        <Modal open={showInterfaceModal} onClose={() => setShowLangModal(false)} centered={false} size="tiny" dimmer="blurring" scrolling>
            <Modal.Content style={{ height: '40vh', overflow: 'auto' }}>
                <Container textAlign="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <div className="header-2 mt-lg bold" data-cy="choose-lang">
                        <FormattedMessage id="choose-interface-language" />:
                    </div>
                    <div className="flex align-center" style={{ marginTop: '2em', marginBottom: '4em' }}>
                        <Dropdown
                            fluid
                            value={language} // Use the state for default locale
                            options={localeDropdownOptions}
                            selection
                            onChange={(e, data) => setLanguage(data.value)}
                            data-cy="ui-lang-select"
                            style={{ color: '#777', fontSize: '1.1rem', width: '200px' }}
                            scrolling
                            selectOnBlur={false}
                            menuStyle={{ maxHeight: '200px', overflowY: 'auto' }}
                        />
                    </div>
                  <Button variant="primary" onClick={handleLocaleChange}>
                    <FormattedMessage id="Continue" />
                  </Button>
                </Container>
            </Modal.Content>
        </Modal>
    )
}

export default InterfaceLanguageView
