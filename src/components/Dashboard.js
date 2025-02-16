import React, { useCallback, useEffect, useRef, useState } from 'react';

import { db } from "../firebase";
import { onValue, ref, set } from "firebase/database";

import Chart from 'chart.js/auto';
// icons
import { MdWbSunny, MdOutlineBatteryChargingFull } from "react-icons/md";
import { BsFire } from "react-icons/bs";
// chakra
import { 
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  Stack, 
  Switch, 
  PopoverFooter,
  Skeleton,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  useToast

} from '@chakra-ui/react';

const BarChart = ({deg180, deg135, deg90 }) => { 
  const chartRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const data = [
      { degree: '90 Deg', flowrate: deg90 },
      { degree: '135 Deg', flowrate: deg135 },
      { degree: '180 Deg', flowrate: deg180 },
    ];

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(row => row.degree),

        datasets: [
          {
            label: 'Flowrate',
            data: data.map(row => row.flowrate),
            backgroundColor: ['#6366F1', '#5749d0', '#3B3199'],
            borderColor: '#333333CC',
            borderWidth: 1,
            hoverBackgroundColor: "#261e70",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },

    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [deg180, deg135, deg90]);
  return <canvas ref={chartRef}></canvas>;

};

const Dashboard = () => {
  const toast = useToast();

  const [infos, setInfos] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [valves, setValves] = useState(Array(12).fill(false));
  const [t_temp, setT_Temp] = useState(infos?.target_temperature ?? 0);

  // Ref to track if `valves` has been initialized
  const hasInitializedValves = useRef(false);

  // Define valve mappings for each system
  const systemValves = {
    '90deg': [0, 1, 2], // Valves 1, 2, 3 (indices 0, 1, 2)
    '135deg': [0, 3, 4], // Valves 1, 4, 5 (indices 0, 3, 4)
    '180deg': [0, 5, 6], // Valves 1, 6, 7 (indices 0, 5, 6)
  };

  // Memoize the `updateFDB` function using `useCallback`
  const updateFDB = useCallback((location, val) => {
    if (infos?.[location] !== val) {
      set(ref(db, 'db/' + location), val).then(() => {
        console.log("Success");
        toast({
          title: "Success",
          status: "success",
          isClosable: true,
          position: 'top-right',
        });
      }).catch((error) => {
        console.log(JSON.stringify(error, null, 2));
        toast({
          title: "Error - Check Console",
          status: "error",
          isClosable: true,
          position: 'top-right',
        });
      });
    }
  }, [infos, toast]);

  // Fetch data from Firebase and update `infos` state
  useEffect(() => {
    const query = ref(db, "db");
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        setInfos(data); // Update `infos` state with Firebase data

        // Additional logic based on Firebase data
        if (data?.temperature >= data?.target_temperature) {
          updateFDB("heater", false);
        }
        if (data?.water_level >= 90) {
          updateFDB("pump", false);
        }
      }
    });

    return () => unsubscribe(); // Cleanup Firebase listener on unmount
  }, [updateFDB]);

  // Sync `valves` state with `infos.valves` only once when `infos` arrives
  useEffect(() => {
    if (infos?.valves && !hasInitializedValves.current) {
      setValves(infos.valves); // Update `valves` state when `infos.valves` arrives
      hasInitializedValves.current = true; // Mark as initialized
    }
  }, [infos?.valves]); // Only run this effect when `infos.valves` changes

  // Handler for system toggles
  const handleSystemToggle = (system, isChecked) => {
    const valvesToUpdate = systemValves[system]; // Get the valves for the system
    const newValves = [...valves]; // Create a copy of the current valves state

    // Update the state of the corresponding valves
    valvesToUpdate.forEach((valveIndex) => {
      newValves[valveIndex] = isChecked;
    });

    setValves(newValves); // Update the `valves` state
  };

  // Helper function to check if a system is active
  const isSystemActive = (system) => {
    const valvesToCheck = systemValves[system];
    return valvesToCheck.every((valveIndex) => valves[valveIndex]);
  };
  // const toast = useToast()

  // const [infos, setInfos] = useState({});

  // // form buttons
  // const [loading, setLoading] = useState(false);
  // const [loading2, setLoading2] = useState(false);

  // //  flow systems
  // // const [flowSystem, setFlowSystem] = useState(Array(3).fill(false));

  // //  control valves
  // const [valves, setValves] = useState(Array(12).fill(false));

  // // Target Temperature
  // const [t_temp, setT_Temp] = useState(infos?.target_temperature ?? 0);

  // // Memoize the `updateFDB` function using `useCallback`
  // const updateFDB = useCallback((location, val) => {
  //   // Check if the new value is different from the current value in `infos`
  //   if (infos?.[location] !== val) {
  //     set(ref(db, 'db/' + location), val).then(() => {
  //       console.log("Success");
  //     }).catch((error) => {
  //       console.log(JSON.stringify(error, null, 2));
  //       toast({
  //         title: "Error - Check Console",
  //         status: "error",
  //         isClosable: true,
  //         position: 'top-right',
  //       });
  //     });
  //   }
  // }, [infos, toast]); // Dependencies: `db` and `infos`

  // // Fetch data from Firebase and update `infos` state
  // useEffect(() => {
  //   const query = ref(db, "db");
  //   const unsubscribe = onValue(query, (snapshot) => {
  //     const data = snapshot.val();

  //     if (snapshot.exists()) {
  //       setInfos(data); // Update `infos` state with Firebase data

  //       // Additional logic based on Firebase data
  //       if (data?.temperature >= data?.target_temperature) {
  //         updateFDB("heater", false);
  //       }
  //       if (data?.water_level >= 90) {
  //         updateFDB("pump", false);
  //       }
  //     }
  //   });

  //   return () => unsubscribe(); // Cleanup Firebase listener on unmount
  // }, [updateFDB]); // Dependencies: `db` and `updateFDB`
 
  //  // Sync `valves` state with `infos.valves` when `infos` changes
  //  useEffect(() => {
  //   if (infos?.valves) {
  //     setValves(infos?.valves); // Update `valves` state when `infos.valves` arrives
  //   }
  // }, [infos]); // Only run this effect when `infos` changes
 
  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-start py-5">
      {/* Board */}
      <div className='w-[90vw] md:w-max rounded-md md:p-2 mb-2 md:mb-0 flex flex-col items-center'>
        <div className='w-full min-w-[250px] bg-green-700 text-white px-2 py-1 mb-4 rounded-md'>
            <div>
                <p className='text-sm text-gray-300'>System Status</p>
                <p className='font-semibold text-lg capitalize my-1'>{!infos?.heater && !infos?.pump &&"Idle"} {infos?.pump && "Pumping"} {infos?.heater && infos?.pump && "|"} {infos?.heater && "Heating"}</p>
            </div>
            <div className='text-gray-300 text-sm'>Target: {infos?.target_temperature ?? "0"}°C | {infos?.power ?? "0"}W Used</div>
        </div>

        {/* Water Level */}
        <Popover>
          <PopoverTrigger>
            <div className='w-full'>
              <Tooltip label={infos?.pump && "Pumping"} placement='top'>
                <div 
                  className={`${infos?.water_level >= 90 || infos?.pump ? "hover:bg-slate-50 bg-[#6366F1] text-white hover:text-[#6366F1]" : "bg-white text-[#6366F1] hover:bg-[#6366F1]  hover:text-white"} ease p-2 rounded-md flex items-center justify-between w-full mb-4 min-w-[250px] cursor-pointer`}
                  >
                    <div className='flex justify-center items-center'>
                        <MdWbSunny />
                        <p className='ml-2 mr-4 '>Water Level</p>
                    </div>
                    <div className='ml-2 mr-4 flex items-center'>
                      {infos?.pump &&
                        <div>
                          <MdOutlineBatteryChargingFull />
                        </div>
                      }
                      <p>
                        {infos?.water_level ?? "0"}%
                      </p>
                    </div>
                </div>
              </Tooltip>
            </div>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader className="text-base font-semibold">
                {infos?.water_level > 50 ? "Status" : "Confirmation"}
              </PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody className='w-max'>
                <div className='py- 3'>
                  <p>Tank Water level is {infos?.water_level >= 90 ? "FULL" : infos?.water_level > 49 ? "OK" : "LOW"}</p>
                </div>
              </PopoverBody>
              {infos?.water_level < 90 && 
                <PopoverFooter>
                  <Button 
                    variant='solid' 
                    background='#3B3199' 
                    color='white' 
                    _hover={{ bg: '#2563eb'}} 
                    size="sm" 
                    className='uppercase'
                    onClick={() => updateFDB("pump", !infos?.pump)}          
                  >{infos?.pump ? "OFF PUMP" : "ON PUMP"}</Button>
                </PopoverFooter>
              }

            </PopoverContent>
          </Portal>
        </Popover>
        
        {/* Temperature */}
        <Popover>
          <PopoverTrigger>
            <div 
              className={`${infos?.temperature >= infos?.target_temperature ? "hover:bg-slate-50 bg-orange-600 text-white hover:text-orange-600" :"bg-white text-orange-600 hover:bg-orange-600  hover:text-white"} cursor-pointer p-2 rounded-md flex items-center justify-between w-full mb-4 min-w-[250px]`}
            >
              <div className='flex justify-center items-center'>
                <MdWbSunny />
                <p className='ml-2 mr-4 '>Temperature</p>
              </div>
              <p className='ml-2 mr-4 '>{infos?.temperature ?? "0"}°C</p>
            </div>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader className="text-base font-semibold"> Confirmation
              </PopoverHeader>
              <PopoverCloseButton /> 
                <PopoverBody>
                  {/* {infos?.temperature >= infos?.target_temperature ? "Status" : "Confirmation"} */}
                  <p>Target Temperature: {infos?.target_temperature}°C</p>
                  {infos?.target_temperature >= 0 ?
                    <NumberInput 
                      className="my-3" 
                      defaultValue={infos?.target_temperature} 
                      min={0}
                      value={t_temp}
                      onChange={(val) => setT_Temp(val)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput> 
                      :
                    <Spinner
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='blue.500'
                    />
                  }
                  
                </PopoverBody>
                <PopoverFooter>
                  <Button 
                    variant='solid' 
                    background='#3B3199' 
                    color='white' 
                    _hover={{ bg: '#2563eb'}} 
                    size="sm"
                    className='w-full'
                    onClick={() => updateFDB("target_temperature", t_temp)} 
                  >
                    SAVE
                  </Button>
                </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>

        {/* Heater */}
        <Popover>
          <PopoverTrigger>
            <div 
              className={`${infos?.heater ? "bg-red-600 [#6366F1] hover:bg-slate-50  hover:text-red-600" : "hover:bg-red-600 [#6366F1] bg-slate-50 text-red-600 hover:text-white"} cursor-pointer ease p-2 rounded-md flex items-center justify-between w-full mb-4 min-w-[250px]`}
            >
              <div className='flex justify-center items-center'>
                <BsFire />
                <p className='ml-2 mr-4 '>Heater</p>
              </div>
              <p className='ml-2 mr-4 '>{infos?.heater ? "ON" : "OFF"}</p>
            </div>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader className="text-base font-semibold">
                {infos?.temperature >= infos?.target_temperature ? "Status" : "Confirmation"}
              </PopoverHeader>
              <PopoverCloseButton /> 
                {infos?.temperature >= infos?.target_temperature ? 
                  <PopoverBody>
                    Target Temperature ({infos?.target_temperature}°C) Reached
                  </PopoverBody>
                :
                  <PopoverFooter>
                    <Button 
                      variant='solid' 
                      background='red.600' 
                      color='white' 
                      _hover={{ bg: 'red.600'}} 
                      size="sm"
                      onClick={() => updateFDB("heater", !infos?.heater)} 
                    >
                      TURN {infos?.heater ? "OFF" : "ON"}
                    </Button>
                  </PopoverFooter>
                }
            </PopoverContent>
          </Portal>
        </Popover>

        {/* Form */}
        <div className='bg-[#333333CC] slate-300 p-2 rounded-md text-slate-300 w-full'>
            <p className='font-semibold text-lg'>Enable Flow</p>
            <div className='mt-4 mb-8 slate-300space-nowrap '>

            {/* <Stack spacing={[1, 5]} direction={['column', 'column']}>
                <div className='flex items-center'>
                  <Switch 
                    size='sm' 
                    defaultChecked 
                  />
                  <p className='ml-3'>90 Deg System</p>
                </div>
                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-3'>135 Deg System</p>
                </div>
                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-3'>180 Deg System</p>
                </div> 
            </Stack> */}

            <Stack spacing={[1, 5]} direction={['column', 'column']}>
              {/* 90 Deg System */}
              <div className='flex items-center'>
                <Switch
                  size='sm'
                  isChecked={isSystemActive('90deg')} // Reflects the state of valves 1, 2, 3
                  onChange={(e) => handleSystemToggle('90deg', e.target.checked)}
                />
                <p className='ml-3'>90 Deg System</p>
              </div>

              {/* 135 Deg System */}
              <div className='flex items-center'>
                <Switch
                  size='sm'
                  isChecked={isSystemActive('135deg')} // Reflects the state of valves 1, 4, 5
                  onChange={(e) => handleSystemToggle('135deg', e.target.checked)}
                />
                <p className='ml-3'>135 Deg System</p>
              </div>

              {/* 180 Deg System */}
              <div className='flex items-center'>
                <Switch
                  size='sm'
                  isChecked={isSystemActive('180deg')} // Reflects the state of valves 1, 6, 7
                  onChange={(e) => handleSystemToggle('180deg', e.target.checked)}
                />
                <p className='ml-3'>180 Deg System</p>
              </div>
            </Stack>
            </div>

            {/* <div>
                <Button 
                  variant='solid' 
                  background='#3B3199' 
                  color='white'
                  _hover={{ bg: '#2563eb'}} 
                  className='w-full'
                  // Firebase database
                  onClick={() => {
                    setLoading(true)
                    // updateFDB("valves", valves)
                    setTimeout(() => {
                      setLoading(false)
                    }, 500);

                  }}
                >
                  {loading ? 
                    <Spinner
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='blue.500'
                    />
                  :
                  <p>Save</p>
                  }      
                </Button>
            </div> */}
        </div>
      </div>

      {/* Graphs and Control */}
      <div className='flex justify-center flex-col md:flex-row'>
        <div className='w-full bg-[#333333CC] slate-300 rounded-md m-2 min-h-[500px] md:min-w-[33vw] max-w-[90vw] md:max-w-[500px]'>
          
          {infos?.flowrate ? 
            <BarChart 
              deg180={infos?.flowrate?.deg180}
              deg135={infos?.flowrate?.deg135}
              deg90={infos?.flowrate?.deg90}
            />
            :
            <div className='flex flex-col items-center justify-center w-full h-full p-3'>
              {[...Array(9)].map((_, index) => (
                <Skeleton key={index} height="20px" className="w-full my-2" />
              ))}     
            </div>
          }
        </div>

        <div className='bg-[#333333CC] -slate-300 h-max p-2 rounded-md text-slate-300 -[#171717] md:min-w-[250px] m-2'>
          <div className='flex items-center justify-between mb-2'>
            <p className='font-semibold text-lg mr-3 w- full'>Control Valves</p>
            <div  
                className={`flex items-center justify-center rounded-md cursor-pointer px-3 py-1 bg-red-600 hover:bg-red-800 ease text-white ${!infos?.valves && "hidden"}`}
                onClick={() => {
                  setLoading2(true)
                  updateFDB("valves", Array(12).fill(false))
                  setValves(Array(12).fill(false))
                  setTimeout(() => {
                    setLoading2(false)
                  }, 500);

                }}
              >
                {loading2 ? 
                  <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='red.200'
                  />
                :
                <p>Reset</p>
                }   
              </div>
          </div>
          <div className='mt-4 mb-8 slate-300space-nowrap '> 
            <Stack spacing={[1, 5]} direction={['column', 'column']}>
              {JSON.stringify(valves)}
              {JSON.stringify(infos?.valves)}
              {[...Array(Math.ceil(valves.length / 2)).keys()].map((row) => (
                <div 
                  key={row} 
                  className='grid grid-cols-2 gap-4'
                >
                  {[0, 1].map((col) => {
                    const valveIndex = row * 2 + col;
                    if (valveIndex < valves.length) {
                      return (
                        <div key={valveIndex} className='flex items-center'> 
                        {infos?.valves ?
                          <Switch
                            size='sm'
                            // defaultChecked={infos?.valves?.[valveIndex]}
                            // isChecked={infos?.valves?.[valveIndex]}
                            // defaultChecked={valves[valveIndex]}
                            isChecked={valves[valveIndex]}
                            onChange={(e) => {
                              const newValves = [...valves];
                              newValves[valveIndex] = e.target.checked;
                              setValves(newValves);
                            }}
                          /> :
                          <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                          />
                        }
                          <p className='ml-2'>Valve {valveIndex + 1}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </Stack>
          </div>

          <div className='mt-8 mb-2'> 
              <Button 
                variant='solid' 
                background='#3B3199' 
                color='white' 
                _hover={{ bg: '#2563eb'}} 
                className='w-full'
                // Firebase database
                onClick={() => {
                  setLoading3(true)
                  updateFDB("valves", valves)
                  setTimeout(() => {
                    setLoading3(false)
                  }, 500);

                }}
              >
                {loading3 ? 
                  <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                  />
                :
                <p>Save</p>
                }                
              </Button>
          </div>
        </div>
      </div>    
    </div>

  );

};

export default Dashboard;