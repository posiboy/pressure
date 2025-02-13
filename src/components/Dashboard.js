import React, { useEffect, useRef } from 'react';

import Chart from 'chart.js/auto';
import { MdWbSunny } from "react-icons/md";
import { BsFire } from "react-icons/bs";
import { Button, Checkbox, Stack } from '@chakra-ui/react';

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
  return (

    <div className="w-full flex flex-col justify-center my-4">

        {/* Graphs */}
        <div className='flex justify-center my-4'>
            <div className='w-full bg-slate-300 rounded-md m-2 min-h-[500px]'>
            <BarChart />
            </div>

            <div className='w -full bg -slate-300 rounded-md m-2 text- [#171717]'>
                <div className='w-full min-w-[250px] bg-green-700 text-white px-2 py-1 mb-4 rounded-md'>
                    <div className='mb-2'>
                        <p className='text-sm text-gray-300'>System Status</p>
                        <p className='font-semibold text-lg'>Running</p>
                    </div>
                    <div className='text-gray-300'>180W used</div>
                </div>

            <div className='bg-[#6366F1] p-2 rounded-md flex items-center justify-between w-full mb-4 min-w-[250px]'>
                <div className='flex justify-center items-center'>
                    <MdWbSunny />
                    <p className='ml-2 mr-4 '>Water Level</p>
                </div>
                <p className='ml-2 mr-4 '>80%</p>
            </div>
            
            <div className='bg-red-600 [#6366F1] p-2 rounded-md flex items-center justify-between w-full mb-4 min-w-[250px]'>
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
                <p className='ml-2 mr-4 '>80°C</p>
            </div>

            {/* Form */}
            <div className='bg-slate-300 p-2 rounded-md text-[#171717] text-lg'>
                <p className='font-semibold'>Enable Flow</p>
                <div className='mt-4 mb-8 slate-300space-nowrap '>

                <Stack spacing={[1, 5]} direction={['column', 'column']}>
                    <Checkbox size='md' defaultChecked>
                        90 Deg System
                    </Checkbox>
                    <Checkbox size='md' defaultChecked>
                        135 Deg System
                    </Checkbox>
                    <Checkbox size='md' defaultChecked>
                        180 Deg System
                    </Checkbox>
                </Stack>
                </div>

                <div>
                    <Button variant='solid' background='#3B3199' color='white' _hover={{ bg: '#2563eb'}} className='w-full'>Save</Button>
                </div>
            </div>
            </div>

        </div>    
    </div>

  );

};



export default Dashboard;