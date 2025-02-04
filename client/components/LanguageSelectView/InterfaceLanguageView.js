import { FormattedMessage } from 'react-intl'
import { localeOptions, localeNameToCode } from 'Utilities/common'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Dropdown, Container } from 'semantic-ui-react'

import { setLocale } from 'Utilities/redux/localeReducer'
import { updateLocale } from 'Utilities/redux/userReducer'

const InterfaceLanguageView = ({ setShowLangModal, showInterfaceModal }) => {
    const dispatch = useDispatch()

    const { data, pending } = useSelector(({ user }) => user)
    const { user } = data

    const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])
    const [defaultLocale, setDefaultLocale] = useState(user?.user?.interfaceLanguage)

    useEffect(() => {
        const temp = localeOptions.map(option => ({
            value: option.code,
            text: option.displayName,
            key: option.code,
        }))
        setLocaleDropdownOptions(temp)

        if (user?.interfaceLanguage) {
            setDefaultLocale(localeNameToCode(user.interfaceLanguage))
        }
    }, [dispatch, user])

    const handleLocaleChange = (newLocale) => {
        dispatch(setLocale(newLocale))
        if (user) dispatch(updateLocale(newLocale))
        setShowLangModal(false)
    }

    return (
        <Modal open={showInterfaceModal} onClose={() => setShowLangModal(false)} centered={false} size="tiny" dimmer="blurring" scrolling>
            <Modal.Content style={{ height: '40vh', overflow: 'auto' }}>
                <Container textAlign="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <div className="header-2 mt-lg bold" data-cy="choose-lang">
                        <FormattedMessage id="interface-language" />
                    </div>
                    <div className="flex align-center" style={{ marginTop: '1em' }}>
                        <div style={{ whiteSpace: 'nowrap', marginRight: '.5em', fontSize: '1.2rem' }}>
                            <FormattedMessage id="select-interface-language" />:
                        </div>
                        <Dropdown
                            fluid
                            value={defaultLocale} // Use the state for default locale
                            options={localeDropdownOptions}
                            selection
                            onChange={(e, data) => handleLocaleChange(data.value)}
                            data-cy="ui-lang-select"
                            style={{ color: '#777', fontSize: '1.1rem', width: '200px' }}
                            scrolling
                            selectOnBlur={false}
                            menuStyle={{ maxHeight: '200px', overflowY: 'auto' }}
                        />
                    </div>
                </Container>
            </Modal.Content>
        </Modal>
    )
}

export default InterfaceLanguageView
