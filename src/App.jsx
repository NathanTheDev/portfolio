import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Pages from './pages/Pages'

function App() {
  return (
    <>
      <HashRouter>
        <Pages />
      </HashRouter>
    </>
  )
}

export default App
