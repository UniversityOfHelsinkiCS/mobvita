import React, { useState, useEffect } from 'react'
import NavBar from 'Components/NavBar'
import Router from 'Components/Router'
import { Link } from 'react-router-dom'
import { Sidebar, Segment, Menu, Header, Image, Icon, Button, Dropdown } from "semantic-ui-react"
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { localeOptions } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { useSwipeable, Swipeable } from 'react-swipeable'



import { logout } from 'Utilities/redux/userReducer'



export default function Bar() {
    const intl = useIntl()
    const dispatch = useDispatch()

    const [visible, setVisible] = useState(false)
    const [active, setActive] = useState('home')
    const [language, setLanguage] = useState('')

    const { user } = useSelector(({ user }) => ({ user: user.data }))

    const signOut = () => dispatch(logout())
    const chooseLanguage = code => () => dispatch(setLocale(code))

    useEffect(() => {
        const currentLanguge = window.location.pathname.split('/')[2]
        setLanguage(currentLanguge)
    }, [window.location.pathname])


    const handleSwipe = (event) => {
        if (event.dir === "Left") {
            setVisible(false)
        }
    }


    return (
        <Swipeable onSwiped={(eventData) => handleSwipe(eventData)} >
            <Sidebar.Pushable as={Segment}>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    inverted
                    onHide={() => setVisible(false)}
                    vertical
                    visible={visible}
                    width='wide'
                >

                    {user && (
                        <Menu.Item>
                            <Button inverted onClick={signOut}>
                                Sign out
                        </Button>
                        </Menu.Item>
                    )}

                    <Menu.Item
                        as={Link}
                        to={`/`}
                        content={intl.formatMessage({ id: 'HOME' })}
                        icon="home"
                    />

                    <Menu.Item
                        as={Link} to={`/stories/${language}#home`}
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

                <Sidebar.Pusher>

                    <Button onClick={() => setVisible(!visible)}>Open navbar</Button>

                    <div style={{ backgroundColor: '#fafafa' }}>
                        <div className="content">
                            <Router />
                        </div>
                    </div>
                </Sidebar.Pusher>

            </Sidebar.Pushable>
        </Swipeable>
    )
}
