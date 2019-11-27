import React, { useState, useEffect } from 'react'
import Router from 'Components/Router'
import { Link } from 'react-router-dom'
import { Sidebar, Segment, Menu, Button, Dropdown, Icon } from "semantic-ui-react"
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Swipeable, useSwipeable } from 'react-swipeable'

import { localeOptions } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from "Utilities/redux/sidebarReducer"
import { logout } from 'Utilities/redux/userReducer'



export default function Bar() {
    const intl = useIntl()
    const dispatch = useDispatch()

    const [language, setLanguage] = useState('')

    const { user } = useSelector(({ user }) => ({ user: user.data }))
    const open = useSelector(({ sidebar }) => sidebar.open)


    const signOut = () => dispatch(logout())
    const chooseLanguage = code => () => dispatch(setLocale(code))


    const menuClickWrapper = (func) => {
        func()
        dispatch(sidebarSetOpen(false))
    }

    useEffect(() => {
        const currentLanguge = window.location.pathname.split('/')[2]
        setLanguage(currentLanguge)
    }, [window.location.pathname])

    return (
        <Swipeable onSwipedRight={() => dispatch(sidebarSetOpen(true))} onSwipedLeft={() => dispatch(sidebarSetOpen(false))} trackMouse={true} >
            <Sidebar.Pushable as={Segment}>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    vertical
                    //onHide={() => dispatch(sidebarSetOpen(false))}
                    visible={open}
                    width='thin'
                >

                    {user && (
                        <Menu.Item
                            onClick={() => menuClickWrapper(signOut)}
                            icon='log out'
                            content={user.user.username}
                        />
                    )

                    }

                    <Menu.Item
                        as={Link}
                        onClick={() => dispatch(sidebarSetOpen(false))}
                        to={`/`}
                        content={intl.formatMessage({ id: 'HOME' })}
                        icon="home"
                    />

                    <Menu.Item
                        as={Link} to={`/stories/${language}#home`}
                        onClick={() => dispatch(sidebarSetOpen(false))}
                        icon="gamepad"
                        content="Stories"
                    />

                    <Menu.Item>
                        <Dropdown text={intl.formatMessage({ id: 'LANGUAGE' })}>
                            <Dropdown.Menu>
                                {localeOptions.map(locale => (
                                    <Dropdown.Item key={locale.code} onClick={chooseLanguage(locale.code)}>
                                        {locale.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>

                </Sidebar>

                <div style={{ backgroundColor: '#fafafa' }}>
                    <div className="content">
                        <Router />
                    </div>
                </div>


            </Sidebar.Pushable>
        </Swipeable>
    )
}
