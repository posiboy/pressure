import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import { Authenticate, Dashboard, Header } from './components'
import useOnlineStatus from './utils/useOnlineStatus';
import { RiWifiOffLine } from 'react-icons/ri';

const App = () => {
  const isOnline = useOnlineStatus();

  return (
    <ChakraProvider>
      <div 
        style={{
          backgroundImage: 'url(./assets/doodle.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          width: '100%',
        }}
      
        className="bg-[#171717] text-white h-full min-h-screen overflow -hidden relative"> 
        {/* Offline check */}
        {!isOnline &&
          <div className="absolute w-full h-full flex items-center justify-center z-50 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
            <div className="bg-[#333333] rounded-md p-5 flex flex-col items-center justify-center">
              <div>
                <RiWifiOffLine className='text-7xl' />
              </div>
              <p className='mt-5 text-2xl'>System Offline</p>
              <p className='text-gray-300'>We're not the same without you</p>
            </div>
          </div>
        }
        <BrowserRouter>
          <Routes>
            <Route 
              path="*" 
              element={
                <>
                  <Header />
                  <Authenticate />
                </>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <>
                  <Header />
                  <Dashboard />
                </>
              } 
            />
          </Routes>
        </BrowserRouter>
      
      </div>
    </ChakraProvider>
    
  )
}

export default App