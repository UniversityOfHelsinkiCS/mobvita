import React from 'react'
import {Link} from "react-router-dom"
import {Container, Header, Button} from "semantic-ui-react"

export const LanguageSelectView = () => {
    return (
        <div>
            <Container textAlign="center">
                <Header as="h2">Which language would you like to practice?</Header>
                <Link to="/stories"><Button primary>Finnish</Button></Link>


            </Container>
        </div>
    )
}
