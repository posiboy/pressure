import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Dashboard, Header } from './components'

const App = () => {
  return (
    <ChakraProvider>
      <div 
        style={{
          backgroundImage: 'url(./assets/doodle.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          width: '100%',
        }}
      
        className="bg-[#171717] text-white h-full min-h-screen overflow-hidden"> 
        <Header />
        <Dashboard/>
      </div>
    </ChakraProvider>
    
  )
}

export default App