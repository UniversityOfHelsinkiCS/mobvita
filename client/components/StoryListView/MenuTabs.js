import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import StoryList from "Components/StoryListView/StoryList"



const panes = [
    { menuItem: "Home", render: () => <Tab.Pane>TODO</Tab.Pane> },
    { menuItem: 'Library', render: () => <Tab.Pane><StoryList /></Tab.Pane> }
]

const Tabs = () => (
    <div style={{ minWidth: "20em", maxWidth: "60em", margin: "0 auto" }}>
        <Tab panes={panes} renderActiveOnly={true} defaultActiveIndex={1} />
    </div>
)

export default Tabs


