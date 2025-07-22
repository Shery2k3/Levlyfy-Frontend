'use client';

import { useState, useEffect } from 'react';
import { Device } from '@twilio/voice-sdk';
import axiosInstance from '../lib/api';

// Use the verified phone number from your .env
const VERIFIED_PHONE_NUMBER_TO_CALL = '+923142113157'; 

const Dialer = () => {
  const [twilioDevice, setTwilioDevice] = useState<Device | null>(null);
  const [callStatus, setCallStatus] = useState('Offline');
  const [conn, setConn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch token and initialize Twilio Device
  useEffect(() => {
    const setupTwilioDevice = async () => {
      try {
        setIsLoading(true);
        
        // Use axiosInstance instead of fetch and correct endpoint
        const response = await axiosInstance.get('/twilio/token');
        const data = response.data;
        
        const device = new Device(data.token, {
          edge: 'ashburn',
        });

        device.on('ready', () => {
          console.log('Twilio Device is ready.');
          setCallStatus('Ready');
        });

        device.on('error', (error) => {
          console.error('Twilio Device Error:', error);
          setCallStatus('Error');
        });
        
        device.on('connect', (connection) => {
          console.log('Successfully established call!');
          setCallStatus('On Call');
          setConn(connection);
        });

        device.on('disconnect', () => {
          console.log('Call disconnected.');
          setCallStatus('Ready');
          setConn(null);
        });

        setTwilioDevice(device);
      } catch (error) {
        console.error('Error setting up Twilio Device:', error);
        setCallStatus('Error');
      } finally {
        setIsLoading(false);
      }
    };

    setupTwilioDevice();

    return () => {
      // Cleanup device on component unmount
      if (twilioDevice) {
        twilioDevice.destroy();
        setTwilioDevice(null);
      }
    };
  }, []);

  const handleCall = () => {
    if (!twilioDevice) {
      alert('Twilio Device not initialized.');
      return;
    }
    
    // The 'To' parameter is sent to your /api/twilio/voice webhook
    const params = { To: VERIFIED_PHONE_NUMBER_TO_CALL };

    console.log(`Attempting to call ${params.To}...`);
    twilioDevice.connect({ params });
  };

  const handleHangup = () => {
    if (twilioDevice) {
      twilioDevice.disconnectAll();
    }
  };

  if (isLoading) {
    return (
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>Web Dialer</h2>
        <p>Loading Twilio Device...</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h2>Web Dialer</h2>
      <p>Status: <strong style={{ color: callStatus === 'On Call' ? 'green' : callStatus === 'Error' ? 'red' : 'black' }}>{callStatus}</strong></p>
      
      {callStatus !== 'On Call' ? (
        <button 
          onClick={handleCall} 
          disabled={callStatus !== 'Ready'}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: callStatus === 'Ready' ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: callStatus === 'Ready' ? 'pointer' : 'not-allowed'
          }}
        >
          Call Verified Number
        </button>
      ) : (
        <button 
          onClick={handleHangup} 
          style={{ 
            padding: '10px 20px',
            backgroundColor: 'red', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Hang Up
        </button>
      )}

      <p style={{marginTop: '15px', fontSize: '12px', color: '#666'}}>
        This will attempt to call: {VERIFIED_PHONE_NUMBER_TO_CALL}
      </p>
    </div>
  );
};

export default Dialer;