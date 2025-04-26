import { useState } from 'react'
import './App.css'
import Index from './components/Main/Index'
import { ToastContainer } from 'react-toastify'
import 'primeicons/primeicons.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Index />
    </>
  )
}

export default App
