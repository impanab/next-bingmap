'use client';
import React, { useEffect, useRef, useState } from 'react';
import  Style  from '@/app/Style/bingmap.module.css';

interface Pushpin {
  location: { latitude: number; longitude: number };
  options: {
    title: string;
    subTitle: string;
    enableClickedStyle: boolean;
    enableHoverStyle: boolean;
    color: string;
    icon?: string;
  };
  infobox: {
    title: string;
    description: string;
    visible: boolean;
  };
}

interface BingMapProps {
  apiKey: string;
  center: { latitude: number; longitude: number };
  mapTypeId: string;
  navigationBarMode: string;
  pushpins: Pushpin[];
}

const BingMap: React.FC<BingMapProps> = ({ apiKey, center, mapTypeId, navigationBarMode, pushpins }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadMapScript = () => {
      if (document.getElementById('bing-maps-script')) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'bing-maps-script';
      script.src = `https://www.bing.com/api/maps/mapcontrol?callback=loadMap&key=${apiKey}`;
      script.async = true;
      script.defer = true;
      window.loadMap = () => setScriptLoaded(true); // Callback function to set scriptLoaded to true
      document.body.appendChild(script);
    };

    if (typeof window !== 'undefined') {
      loadMapScript();
    }
  }, [apiKey]);

  useEffect(() => {
    if (scriptLoaded && window.Microsoft && mapRef.current) {
      console.log( window.Microsoft)
      const map = new Microsoft.Maps.Map(mapRef.current, {
        credentials: apiKey,
        center: new Microsoft.Maps.Location(center.latitude, center.longitude),
        mapTypeId: Microsoft.Maps.MapTypeId[mapTypeId.toUpperCase()],
        navigationBarMode: navigationBarMode,
      });

      pushpins.forEach((pushpin) => {
        const location = new Microsoft.Maps.Location(pushpin.location.latitude, pushpin.location.longitude);
        const pin = new Microsoft.Maps.Pushpin(location, {
          ...pushpin.options,
          icon: pushpin.options.icon, 
        });
        map.entities.push(pin);

        if (pushpin.infobox.visible) {
          const infobox = new Microsoft.Maps.Infobox(location, {
            title: pushpin.infobox.title,
            description: pushpin.infobox.description,
          });
          infobox.setMap(map);
        }
      });
    }
  }, [scriptLoaded, apiKey, center, mapTypeId, navigationBarMode, pushpins]);

  return <div ref={mapRef} className={Style.map_container} />;
};

export default BingMap;
