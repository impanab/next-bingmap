'use client'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
const BingMap = dynamic(() => import('./components/bingMap'), { ssr: false });

const App = () => {
  const [apiKey] = useState('YOUR_API_KEY_HERE');
  // const [apiKey] = useState('Agk0yfBzkP1KmKNk3oM4EllYqe3Hz913hUxLe7QmovAJr72u0zJyvNKGcsERHh6E');
 
  const [mapType, setMapType] = useState('aerial');
  const [navigationBarMode, setNavigationBarMode] = useState('square');
  const [location,setLoacation]=useState({lattitude:0,longitude:0})
  const [pushpins, setPushpins] = useState([
    {
      location: { latitude: 40.4319, longitude: 116.5704 },
      options: {
        title: 'The Great Wall of China',
        subTitle: 'Huairou, China',
        enableClickedStyle: true,
        enableHoverStyle: true,
        color: '#673ab7',
        icon: 'https://www.bingmapsportal.com/Content/images/poi_custom.png', 
      },
      infobox: {
        title: 'The Great Wall of China',
        description:
          'The Great Wall of China is a series of fortifications that were built across the historical northern borders of ancient Chinese states and Imperial China as protection against various nomadic groups from the Eurasian Steppe.',
        visible: false,
      },
    },
  ]);

  const { register, handleSubmit, reset } = useForm();
  const getGeoLocation=()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position)=>{
          setLoacation({lattitude:position.coords.latitude,longitude:position.coords.longitude})
         console.log(position)
        // console.log(navigator)
        }
      )
    }
    }
 useEffect(()=>{
  getGeoLocation()
 },[])

  const onSubmit = (data: { latitude: string; longitude: string; title: any; subTitle: any; color: any; icon: any; description: any; }) => {
    const newPushpin = {
      location: { latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude) },
      options: {
        title: data.title,
        subTitle: data.subTitle,
        enableClickedStyle: true,
        enableHoverStyle: true,
        color: data.color,
        icon: data.icon, 
      },
      infobox: {
        title: data.title,
        description: data.description,
        visible: false,
      },
    };
    setPushpins([...pushpins, newPushpin]);
    reset();
  };

  return (
    <div>
    
      <div className='map-container'>
        <BingMap
          apiKey={apiKey}
          center={{ latitude: 40.4319, longitude: 116.5704 }}
          mapTypeId={mapType}
          navigationBarMode={navigationBarMode}
          pushpins={pushpins}
        />
      </div>
    </div>
  );
};

export default App;