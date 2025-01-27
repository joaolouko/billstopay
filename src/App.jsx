import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Main from './pages/main'
import Create from './pages/Create'
import Nav from './components/layout/Nav'


function App() {
  return (
    <> 
      
      <BrowserRouter>
      
        <Routes>
          <Route path='/' element={<Main/>} />
          <Route path='/criar' element={<Create/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
