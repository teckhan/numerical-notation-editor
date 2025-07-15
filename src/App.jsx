import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Editor from "./view/Editor";
import globalStore, { GlobalContext } from "./store/global";

function App() {
  const [count, setCount] = useState(0)

  return (
    <GlobalContext.Provider value={globalStore}>
      <Editor></Editor>
    </GlobalContext.Provider>
  )
}

export default App
