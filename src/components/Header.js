import { Tooltip } from '@chakra-ui/react'
import React from 'react'

const Header = () => {
  return (
    <div className='flex items-center justify-between px-3 py-2 w-full'>
        <Tooltip label="Heating, Dispensing and Monitoring System">
            <div className='font-bold text-5xl cursor-pointer'>HDMS</div>
        </Tooltip>
        <div className='cursor-pointer'>Logout</div>
    </div>
  )
}

export default Header