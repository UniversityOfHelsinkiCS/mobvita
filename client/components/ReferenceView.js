import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List } from 'semantic-ui-react'
import Footer from './Footer'
// import { Popup } from 'semantic-ui-react'

const ReferenceView = () => {
  //const dispatch = useDispatch()
  

  return (
    <div className="cont-tall flex-col space-between pt-lg">
      <div className="justify-center">
        <div
          style={{
            width: '100%',
            maxWidth: '1000px',
            fontSize: '1.5rem'
          }}
        >
          <h1>References</h1>
          <List bulleted>
            <List.Item>A reference</List.Item>
            <List.Item>A reference</List.Item>
            <List.Item>
            A reference
              <List.List>
                <List.Item href='#'>A sub reference with link</List.Item>
                <List.Item>A sub reference</List.Item>
                <List.Item>A sub reference</List.Item>
              </List.List>
          </List.Item>
        </List>
        </div>
      </div>
    <Footer />
    </div>
  )
}

export default ReferenceView
