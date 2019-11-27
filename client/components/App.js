import React from "react"
import Bar from "./Bar"
import Router from 'Components/Router'


const App = () => {
  return (
    <>
      <Bar />
      <div style={{ backgroundColor: '#fafafa' }}>
        <div className="content">
          <Router />
        </div>
      </div>
    </>
  )

}


export default App