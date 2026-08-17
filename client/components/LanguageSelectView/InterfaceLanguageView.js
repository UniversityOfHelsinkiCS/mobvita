import { FormattedMessage } from 'react-intl'
import { localeOptions } from 'Utilities/common'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/material'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppSelect from 'Components/ui/AppSelect'

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
        <AppDialog
            open={showInterfaceModal}
            onClose={() => setShowLangModal(false)}
            maxWidth="xs"
            data-cy="interface-language-modal"
            closeDataCy="interface-language-modal-close"
            sx={{ '& .MuiDialogContent-root': { height: '40vh', overflow: 'auto' } }}
        >
            <Container sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                <div className="header-2 mt-lg bold" data-cy="choose-lang">
                    <FormattedMessage id="choose-interface-language" />:
                </div>
                <div className="flex align-center" style={{ marginTop: '2em', marginBottom: '4em' }}>
                    <div data-cy="ui-lang-select">
                        <AppSelect
                            variant="contrast-outline"
                            value={language} // Use the state for default locale
                            options={localeDropdownOptions.map(option => ({
                                value: option.value,
                                label: option.text,
                            }))}
                            onChange={setLanguage}
                            minWidth={200}
                            matchTriggerWidth
                        />
                    </div>
                </div>
                <AppButton
                    variant="primary"
                    onClick={handleLocaleChange}
                    data-cy="interface-language-continue-button"
                >
                    <FormattedMessage id="Continue" />
                </AppButton>
            </Container>
        </AppDialog>
    )
}

export default InterfaceLanguageView
