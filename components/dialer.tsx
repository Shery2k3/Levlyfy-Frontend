"use client";

import React, { useState } from 'react';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTwilio } from '@/hooks/use-twilio';

interface DialerProps {
  onCallStatusChange?: (status: string, phoneNumber?: string) => void;
}

export default function Dialer({ onCallStatusChange }: DialerProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const { callState, makeCall, hangUp, acceptCall, rejectCall, toggleMute, sendDigits } = useTwilio({
    onCallStatusChange: (status, call) => {
      console.log('📞 Call status changed:', status, call);
      if (onCallStatusChange) {
        onCallStatusChange(status, call?.parameters?.To || callState.phoneNumber);
      }
    },
    onError: (error) => {
      console.error('❌ Twilio error:', error);
    }
  });

  // Format phone number as user types - more flexible for international numbers
  const formatPhoneNumber = (value: string) => {
    // Allow + sign, digits, spaces, parentheses, and dashes
    const cleaned = value.replace(/[^\d+\-\(\)\s]/g, '');
    
    // Don't auto-format if it starts with + (international format)
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // Remove all non-digits for US formatting
    const digitsOnly = cleaned.replace(/\D/g, '');
    
    // Format as US number only if it looks like US number
    if (digitsOnly.length >= 10 && digitsOnly.length <= 11) {
      if (digitsOnly.length === 10) {
        return `+1 (${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
      } else if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
        const area = digitsOnly.slice(-10, -7);
        const first = digitsOnly.slice(-7, -4);
        const second = digitsOnly.slice(-4);
        return `+1 (${area}) ${first}-${second}`;
      }
    }
    
    // Return as-is for other formats
    return cleaned;
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(formatPhoneNumber(value));
  };

  const handleDigitClick = (digit: string) => {
    if (callState.status === 'connected') {
      // Send DTMF if in call
      sendDigits(digit);
    } else {
      // Add to phone number if not in call
      const newNumber = phoneNumber + digit;
      setPhoneNumber(formatPhoneNumber(newNumber));
    }
  };

  const handleCall = async () => {
    if (!phoneNumber.trim()) return;
    
    // Convert to E.164 format
    let e164Number = phoneNumber.trim();
    
    // If it already starts with +, use as-is
    if (e164Number.startsWith('+')) {
      e164Number = e164Number.replace(/[\s\-\(\)]/g, ''); // Remove formatting
    } else {
      // Remove all non-digits and convert to E.164
      const cleanedNumber = e164Number.replace(/\D/g, '');
      
      if (cleanedNumber.length === 10) {
        // US number without country code
        e164Number = '+1' + cleanedNumber;
      } else if (cleanedNumber.length === 11 && cleanedNumber[0] === '1') {
        // US number with country code
        e164Number = '+' + cleanedNumber;
      } else {
        // International number - assume it's complete
        e164Number = '+' + cleanedNumber;
      }
    }
    
    console.log('📞 Calling:', e164Number);
    await makeCall(e164Number);
  };

  const handleHangUp = () => {
    hangUp();
    if (callState.status === 'ringing' && callState.phoneNumber) {
      rejectCall();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connecting': return 'bg-yellow-100 text-yellow-800';
      case 'ringing': return 'bg-blue-100 text-blue-800';
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'idle': return callState.isReady ? 'Ready' : 'Initializing...';
      case 'connecting': return 'Connecting...';
      case 'ringing': return 'Ringing...';
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      default: return status;
    }
  };

  const dialPadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  const isInCall = ['connecting', 'ringing', 'connected'].includes(callState.status);
  const canCall = callState.isReady && !isInCall && phoneNumber.trim().length > 0;

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Dialer</span>
          <Badge className={getStatusColor(callState.status)}>
            {getStatusText(callState.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Phone Number Display */}
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
            className="text-center text-lg font-mono"
            disabled={isInCall}
          />
          {callState.phoneNumber && callState.phoneNumber !== phoneNumber && (
            <p className="text-sm text-muted-foreground text-center">
              {callState.status === 'ringing' ? 'Incoming from: ' : 'Connected to: '}
              {callState.phoneNumber}
            </p>
          )}
        </div>

        {/* Error Display */}
        {callState.error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{callState.error}</p>
          </div>
        )}

        {/* Dial Pad */}
        <div className="grid grid-cols-3 gap-2">
          {dialPadNumbers.map((row, rowIndex) =>
            row.map((digit) => (
              <Button
                key={digit}
                variant="outline"
                className="h-12 text-lg font-semibold"
                onClick={() => handleDigitClick(digit)}
              >
                {digit}
              </Button>
            ))
          )}
        </div>

        {/* Call Controls */}
        <div className="flex justify-center space-x-4 pt-4">
          {!isInCall ? (
            <Button
              onClick={handleCall}
              disabled={!canCall}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4"
              size="lg"
            >
              <Phone className="w-6 h-6" />
            </Button>
          ) : (
            <>
              {callState.status === 'ringing' && callState.phoneNumber && (
                <Button
                  onClick={acceptCall}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3"
                >
                  <PhoneCall className="w-5 h-5" />
                </Button>
              )}
              
              <Button
                onClick={handleHangUp}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4"
                size="lg"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
              
              {callState.status === 'connected' && (
                <Button
                  onClick={toggleMute}
                  variant={callState.isMuted ? "default" : "outline"}
                  className="rounded-full p-3"
                >
                  {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              )}
            </>
          )}
        </div>

        {/* Call Duration (when connected) */}
        {callState.status === 'connected' && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Call in progress...
            </p>
          </div>
        )}

        {/* Device Status */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {callState.isReady ? '📱 Device Ready' : '⚠️ Initializing device...'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
