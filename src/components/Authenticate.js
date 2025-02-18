import { useState, useEffect } from 'react';
import { Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Authenticate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = localStorage.getItem("user");
  const [pwd, setPwd] = useState("");

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = () => {
    if (pwd === "2025" || pwd === "Flourish" || pwd === "King" || pwd === "Chelsea") {
      localStorage.setItem("user", "verified");
      navigate("/dashboard");
    } else {
      toast({
        title: "Wrong Password",
        status: "error",
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <>
      {!user && (
        <div className='flex items-start md:items-center justify-center w-full min-h-screen h-full'>
          <div className="bg-[#333333CC] slate-300 rounded-md my-8 mx-2 md:min-w-[33vw] p-2">
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                placeholder='Password'
                type='password'
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />

              <div className='mt-8 mb-2'>
                <Button
                  variant='solid'
                  background='#3B3199'
                  color='white'
                  _hover={{ bg: '#2563eb' }}
                  className='w-full'
                  onClick={handleLogin}
                >
                  Enter
                </Button>
              </div>
            </FormControl>
          </div>
        </div>
      )}
    </>
  );
};

export default Authenticate;