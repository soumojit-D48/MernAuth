import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <AppContextProvider>
    <App />
  </AppContextProvider>
  </BrowserRouter>
  </StrictMode>

)

/*
It creates a kind of global "box" for shared data — but this box is empty by default. 
To fill it with real values (like userData, isLoggedin), you need to use the .Provider component:
<AppContent.Provider value={...}>


 */