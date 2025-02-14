import React, { useEffect, useRef, useState } from 'react';

import { db } from "../firebase";
import { onValue, ref } from "firebase/database";

import Chart from 'chart.js/auto';
import { MdWbSunny } from "react-icons/md";
import { BsFire } from "react-icons/bs";
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
  PopoverFooter

} from '@chakra-ui/react';

const BarChart = () => { 
  const chartRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const data = [
      { degree: '90 Deg', flowrate: 10 },
      { degree: '135 Deg', flowrate: 20 },
      { degree: '180 Deg', flowrate: 35 },
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
            backgroundColor: ['rgba(54, 162, 235, 1)', '#6366F1', '#3B3199'],
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
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
  }, []);
  return <canvas ref={chartRef}></canvas>;

};



const Dashboard = () => {
   const [infos, setInfos] = useState({});

   useEffect(() => {
     const query = ref(db, "db");
     return onValue(query, (snapshot) => {
       const data = snapshot.val();
 
       if (snapshot.exists()) {
         setInfos(data); 
         console.log(JSON.stringify(data, null, 2))
       }
       console.log(infos)
     });
   }, []);

  return (

    <div className="w-full flex flex- col justify-center my-4">
      {/* Board */}
      <div className='rounded-md my-6 mx-2'>
        <div className='w-full min-w-[250px] bg-green-700 text-white px-2 py-1 mb-4 rounded-md'>
            <div className='mb-2'>
                <p className='text-sm text-gray-300'>System Status</p>
                <p className='font-semibold text-lg capitalize'>{infos?.status}</p>
            </div>
            <div className='text-gray-300'>{infos?.power ?? "0"}W Used</div>
        </div>

        <Popover>
          <PopoverTrigger>
            <div className='bg-[#6366F1] hover:bg-slate-50 ease hover:text-[#6366F1] p-2 rounded-md flex items-center justify-between w-full mb-4 min-w-[250px] cursor-pointer'>
                <div className='flex justify-center items-center'>
                    <MdWbSunny />
                    <p className='ml-2 mr-4 '>Water Level</p>
                </div>
                <p className='ml-2 mr-4 '>{infos?.water_level ?? "0"}%</p>
            </div>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              {/* <PopoverHeader>Tank Water level is LOW</PopoverHeader> */}
              <PopoverHeader>
                {infos?.water_level > 50 ? "Status" : "Confirmation"}
              </PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody className='w-max'>
                <div className='py- 3'>

                  <p>Tank Water level is {infos?.water_level > 49 ? "OK" : "LOW"}</p>

                  {/* <Button variant='solid' background='#3B3199' color='white' _hover={{ bg: '#2563eb'}} size="sm">Pump Water</Button> */}
                </div>
              </PopoverBody>
              {infos?.water_level < 50 && 
                <PopoverFooter>
                  <Button variant='solid' background='#3B3199' color='white' _hover={{ bg: '#2563eb'}} size="sm">Pump Water</Button>
                </PopoverFooter>
              }

            </PopoverContent>
          </Portal>
        </Popover>
        
        <div className='bg-red-600 [#6366F1] hover:bg-slate-50 ease hover:text-red-600 p-2 rounded-md flex items-center justify-between w-full mb-4 min-w-[250px]'>
            <div className='flex justify-center items-center'>
                <BsFire />
                <p className='ml-2 mr-4 '>Heater</p>
            </div>
            <p className='ml-2 mr-4 '>ON</p>
        </div>

        <div className='bg-orange-600 [#6366F1] p-2 rounded-md flex items-center justify-between w-full mb-4 min-w-[250px]'>
            <div className='flex justify-center items-center'>
                <MdWbSunny />
                <p className='ml-2 mr-4 '>Temperature</p>
            </div>
            <p className='ml-2 mr-4 '>60°C</p>
        </div>

        {/* Form */}
        <div className='bg-slate-300 p-2 rounded-md text-[#171717]'>
            <p className='font-semibold text-lg'>Enable Flow</p>
            <div className='mt-4 mb-8 slate-300space-nowrap '>

            <Stack spacing={[1, 5]} direction={['column', 'column']}>
                <div className='flex items-center'>
                  <Switch size='md' defaultChecked />
                  <p className='ml-3'>90 Deg System</p>
                </div>
                <div className='flex items-center'>
                  <Switch size='md' defaultChecked />
                  <p className='ml-3'>135 Deg System</p>
                </div>
                <div className='flex items-center'>
                  <Switch size='md' defaultChecked />
                  <p className='ml-3'>180 Deg System</p>
                </div> 
            </Stack>
            </div>

            <div>
                <Button variant='solid' background='#3B3199' color='white' _hover={{ bg: '#2563eb'}} className='w-full'>Save</Button>
            </div>
        </div>
      </div>

      {/* Graphs and Control */}
      <div className='flex justify-center my-4 w-full'>
        <div className='w-full bg-slate-300 rounded-md m-2 min-h-[500px]'>
          <BarChart />
        </div>

        <div className='bg-slate-300 h-max p-2 rounded-md text-[#171717] min-w-[250px] m-2 mr-4'>
          <p className='font-semibold text-lg'>Control Valves</p>
          <div className='mt-4 mb-8 slate-300space-nowrap '>

          <Stack spacing={[1, 5]} direction={['column', 'column']}>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 1</p>
                </div>

                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 2</p>
                </div> 
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 3</p>
                </div>

                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 4</p>
                </div> 
              </div> 
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 5</p>
                </div>

                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 6</p>
                </div> 
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 3</p>
                </div>

                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 4</p>
                </div> 
              </div> 
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 1</p>
                </div>

                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 2</p>
                </div> 
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 3</p>
                </div>

                <div className='flex items-center'>
                  <Switch size='sm' defaultChecked />
                  <p className='ml-2'>Valve 4</p>
                </div> 
              </div> 
          </Stack>
          </div>

          <div className='mt-8 mb-2'> 
              <Button variant='solid' background='#3B3199' color='white' _hover={{ bg: '#2563eb'}} className='w-full'>Save</Button>
          </div>
        </div>
      </div>    
    </div>

  );

};



export default Dashboard;