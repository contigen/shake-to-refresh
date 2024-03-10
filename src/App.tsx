import { useState } from 'react'
import './App.css'
import { Shake } from './shake'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Shake to Refresh using the Device Motion Event.</h1>
      <Shake />
    </div>
  )
}

export default App
