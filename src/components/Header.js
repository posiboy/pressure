import { Image, Tooltip } from '@chakra-ui/react'

const Header = () => {
  const user = localStorage.getItem("user");
  return (
    <div className='fixed top-0 flex items-center justify-between px-3 py-2 w-full z-50 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>
        <div className='flex items-center justify-between w-full'>
          <div>
            <Tooltip label="Bowen University | Excellence and Godliness">
              <Image
                boxSize='50px' 
                // className='rounded-xl'
                className='rounded-full'
                alt='Bowen University' 
                // src='https://www.adexen.com/upload/company-logos/adexen-logo-bowen-university-logo.jpg' 
                // src='bowen-logo.jpg' 
                src='baes-logo.jpg' 
                />
            </Tooltip>
          </div>
          <Tooltip label="Heating, Dispensing and Monitoring System">
              <div className='font-bold text-5xl cursor-pointer'>HDMS </div>
          </Tooltip>
          <div 
            // this is just for spacing
          />
        </div>
        {user && 
            <div 
                className='cursor-pointer'
                onClick={() => localStorage.setItem("user", "")}            
            >Logout</div>        
        }
    </div>
  )
}

export default Header