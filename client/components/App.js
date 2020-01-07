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
      {<span>{`Built at: ${__VERSION__}`}</span>}
    </>
  )

}


export default App