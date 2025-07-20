import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface CallState {
  status: 'idle' | 'connecting' | 'ringing' | 'connected' | 'disconnected' | 'error';
  phoneNumber: string | null;
  callSid: string | null;
  error: string | null;
  isMuted: boolean;
  isReady: boolean;
}

interface UseTwilioOptions {
  onCallStatusChange?: (status: string, call?: any) => void;
  onError?: (error: string) => void;
}

export const useTwilio = (options: UseTwilioOptions = {}) => {
  const { user } = useAuth();
  const [callState, setCallState] = useState<CallState>({
    status: 'idle',
    phoneNumber: null,
    callSid: null,
    error: null,
    isMuted: false,
    isReady: false,
  });
  
  const [token, setToken] = useState<string | null>(null);
  const deviceRef = useRef<any>(null);
  const currentCallRef = useRef<any>(null);

  // Get Twilio access token
  const getAccessToken = async () => {
    try {
      const response = await api.get('/twilio/token');
      console.log('🎫 Access token received:', response.data);
      return response.data.data.token;
    } catch (error) {
      console.error('❌ Error getting access token:', error);
      setCallState(prev => ({ ...prev, error: 'Failed to get access token', status: 'error' }));
      if (options.onError) options.onError('Failed to get access token');
      return null;
    }
  };

  // Initialize Twilio Device
  const initializeDevice = async () => {
    if (!user || deviceRef.current) return;

    try {
      console.log('🔧 Initializing Twilio Device...');
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      setToken(accessToken);

      // Dynamic import to avoid SSR issues
      const { Device } = await import('@twilio/voice-sdk');
      
      const device = new Device(accessToken, {
        edge: 'sydney'
      });

      // Device event listeners
      device.on('ready', () => {
        console.log('📱 Twilio Device ready');
        setCallState(prev => ({ ...prev, isReady: true, status: 'idle' }));
        if (options.onCallStatusChange) options.onCallStatusChange('ready');
      });

      device.on('error', (error: any) => {
        console.error('❌ Device error:', error);
        setCallState(prev => ({ 
          ...prev, 
          error: error.message || 'Device error',
          status: 'error',
          isReady: false 
        }));
        if (options.onError) options.onError(error.message || 'Device error');
      });

      device.on('incoming', (call: any) => {
        console.log('📞 Incoming call from:', call.parameters.From);
        currentCallRef.current = call;
        setCallState(prev => ({
          ...prev,
          status: 'ringing',
          phoneNumber: call.parameters.From,
          callSid: call.parameters.CallSid,
        }));
        
        setupCallListeners(call);
        if (options.onCallStatusChange) options.onCallStatusChange('incoming', call);
      });

      device.on('disconnect', () => {
        console.log('🔌 Device disconnected');
        setCallState(prev => ({ ...prev, isReady: false }));
      });

      deviceRef.current = device;
      console.log('✅ Twilio Device initialized successfully');

      // Set ready state after device is created and stored
      setCallState(prev => ({ ...prev, isReady: true, status: 'idle' }));

    } catch (error: any) {
      console.error('❌ Failed to initialize device:', error);
      setCallState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to initialize device',
        status: 'error' 
      }));
      if (options.onError) options.onError(error.message || 'Failed to initialize device');
    }
  };

  // Setup call event listeners
  const setupCallListeners = (call: any) => {
    call.on('accept', () => {
      console.log('✅ Call accepted');
      setCallState(prev => ({ ...prev, status: 'connected' }));
      if (options.onCallStatusChange) options.onCallStatusChange('accepted', call);
    });

    call.on('disconnect', () => {
      console.log('📴 Call disconnected');
      setCallState(prev => ({ 
        ...prev, 
        status: 'disconnected', 
        phoneNumber: null, 
        callSid: null 
      }));
      currentCallRef.current = null;
      if (options.onCallStatusChange) options.onCallStatusChange('disconnected', call);
    });

    call.on('cancel', () => {
      console.log('🚫 Call cancelled');
      setCallState(prev => ({ 
        ...prev, 
        status: 'idle', 
        phoneNumber: null, 
        callSid: null 
      }));
      currentCallRef.current = null;
      if (options.onCallStatusChange) options.onCallStatusChange('cancelled', call);
    });

    call.on('reject', () => {
      console.log('❌ Call rejected');
      setCallState(prev => ({ 
        ...prev, 
        status: 'idle', 
        phoneNumber: null, 
        callSid: null 
      }));
      currentCallRef.current = null;
      if (options.onCallStatusChange) options.onCallStatusChange('rejected', call);
    });

    call.on('ringing', () => {
      console.log('📱 Call ringing');
      setCallState(prev => ({ ...prev, status: 'ringing' }));
      if (options.onCallStatusChange) options.onCallStatusChange('ringing', call);
    });
  };

  // Make outbound call
  const makeCall = async (phoneNumber: string) => {
    if (!deviceRef.current || !callState.isReady) {
      const error = 'Device not ready';
      console.error('❌', error);
      setCallState(prev => ({ ...prev, error, status: 'error' }));
      if (options.onError) options.onError(error);
      return null;
    }

    try {
      console.log('📞 Making call to:', phoneNumber);
      setCallState(prev => ({ 
        ...prev, 
        status: 'connecting', 
        phoneNumber, 
        error: null 
      }));

      // First, initiate the call through our backend API
      const response = await api.post('/twilio/start-call', { to: phoneNumber });
      console.log('✅ Call initiated via API:', response.data);

      // The backend will trigger Twilio to call the external number
      // and then connect it to our browser client through the webhook
      
      // Wait for the incoming call from Twilio to connect the two ends
      console.log('⏳ Waiting for Twilio to connect the call...');

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to make call:', error);
      setCallState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to make call',
        status: 'error',
        phoneNumber: null 
      }));
      if (options.onError) options.onError(error.message || 'Failed to make call');
      return null;
    }
  };

  // Answer incoming call
  const acceptCall = () => {
    if (currentCallRef.current) {
      console.log('📞 Accepting call');
      currentCallRef.current.accept();
    }
  };

  // Reject incoming call
  const rejectCall = () => {
    if (currentCallRef.current) {
      console.log('❌ Rejecting call');
      currentCallRef.current.reject();
      currentCallRef.current = null;
      setCallState(prev => ({ 
        ...prev, 
        status: 'idle', 
        phoneNumber: null, 
        callSid: null 
      }));
    }
  };

  // Hang up call
  const hangUp = () => {
    if (currentCallRef.current) {
      console.log('📴 Hanging up call');
      currentCallRef.current.disconnect();
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (currentCallRef.current) {
      const newMutedState = !callState.isMuted;
      currentCallRef.current.mute(newMutedState);
      setCallState(prev => ({ ...prev, isMuted: newMutedState }));
      console.log(newMutedState ? '🔇 Call muted' : '🔊 Call unmuted');
    }
  };

  // Send DTMF digits
  const sendDigits = (digits: string) => {
    if (currentCallRef.current) {
      console.log('📟 Sending digits:', digits);
      currentCallRef.current.sendDigits(digits);
    }
  };

  // Initialize device when component mounts
  useEffect(() => {
    if (user && !deviceRef.current) {
      initializeDevice();
    }

    // Cleanup on unmount
    return () => {
      if (deviceRef.current) {
        console.log('🧹 Cleaning up Twilio Device');
        deviceRef.current.destroy();
        deviceRef.current = null;
      }
    };
  }, [user]);

  return {
    callState,
    makeCall,
    acceptCall,
    rejectCall,
    hangUp,
    toggleMute,
    sendDigits,
    initializeDevice,
  };
};
