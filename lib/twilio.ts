// Twilio Voice Service for handling calls
import { Device } from '@twilio/voice-sdk';

export interface TwilioCall {
  sid?: string;
  status?: string;
  direction?: 'inbound' | 'outbound';
  to?: string;
  from?: string;
}

class TwilioService {
  private device: Device | null = null;
  private token: string | null = null;
  private onCallStatusChange: ((status: string, call?: any) => void) | null = null;
  private onError: ((error: any) => void) | null = null;
  private currentCall: any = null;

  constructor() {
    console.log('🔧 TwilioService initialized');
  }

  // Initialize Twilio Device with token
  async initialize(token: string): Promise<boolean> {
    try {
      console.log('🎫 Initializing Twilio Device with token...');
      this.token = token;
      
      // Create new device instance
      this.device = new Device(token, {
        edge: 'sydney'
      });

      // Set up event listeners
      this.setupEventListeners();

      console.log('✅ Twilio Device initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Twilio Device:', error);
      this.onError?.(error);
      return false;
    }
  }

  private setupEventListeners() {
    if (!this.device) return;

    // Device ready
    this.device.on('ready', () => {
      console.log('📱 Twilio Device is ready');
      this.onCallStatusChange?.('ready');
    });

    // Incoming call
    this.device.on('incoming', (call) => {
      console.log('📞 Incoming call from:', call.parameters.From);
      this.onCallStatusChange?.('incoming', call);
    });

    // Device errors
    this.device.on('error', (error) => {
      console.error('❌ Twilio Device error:', error);
      this.onError?.(error);
    });

    // Device disconnect
    this.device.on('disconnect', () => {
      console.log('🔌 Twilio Device disconnected');
      this.onCallStatusChange?.('disconnected');
    });
  }

  // Make an outbound call
  async makeCall(phoneNumber: string): Promise<any> {
    if (!this.device) {
      throw new Error('Twilio Device not initialized');
    }

    try {
      console.log('📞 Making call to:', phoneNumber);
      
      const call = await this.device.connect({
        params: { To: phoneNumber }
      });

      // Set up call event listeners
      call.on('accept', () => {
        console.log('✅ Call accepted');
        this.currentCall = call;
        this.onCallStatusChange?.('accepted', call);
      });

      call.on('disconnect', () => {
        console.log('📴 Call disconnected');
        this.currentCall = null;
        this.onCallStatusChange?.('disconnected', call);
      });

      call.on('cancel', () => {
        console.log('🚫 Call cancelled');
        this.currentCall = null;
        this.onCallStatusChange?.('cancelled', call);
      });

      call.on('reject', () => {
        console.log('❌ Call rejected');
        this.currentCall = null;
        this.onCallStatusChange?.('rejected', call);
      });

      call.on('ringing', () => {
        console.log('📱 Call ringing');
        this.onCallStatusChange?.('ringing', call);
      });

      this.currentCall = call;
      return call;
    } catch (error) {
      console.error('❌ Failed to make call:', error);
      this.onError?.(error);
      throw error;
    }
  }

  // Answer incoming call
  acceptCall(call: any) {
    try {
      console.log('📞 Accepting incoming call');
      call.accept();
    } catch (error) {
      console.error('❌ Failed to accept call:', error);
      this.onError?.(error);
    }
  }

  // Reject incoming call
  rejectCall(call: any) {
    try {
      console.log('❌ Rejecting incoming call');
      call.reject();
    } catch (error) {
      console.error('❌ Failed to reject call:', error);
      this.onError?.(error);
    }
  }

  // Hang up current call
  hangUp(call?: any) {
    try {
      console.log('📴 Hanging up call');
      const callToHangup = call || this.currentCall;
      if (callToHangup) {
        callToHangup.disconnect();
        this.currentCall = null;
      } else {
        console.log('🔍 No active call to hang up');
      }
    } catch (error) {
      console.error('❌ Failed to hang up call:', error);
      this.onError?.(error);
    }
  }

  // Mute/unmute call
  toggleMute(call: any, muted: boolean) {
    try {
      if (muted) {
        call.mute(true);
        console.log('🔇 Call muted');
      } else {
        call.mute(false);
        console.log('🔊 Call unmuted');
      }
    } catch (error) {
      console.error('❌ Failed to toggle mute:', error);
      this.onError?.(error);
    }
  }

  // Send DTMF tones
  sendDigits(call: any, digits: string) {
    try {
      console.log('📟 Sending DTMF:', digits);
      call.sendDigits(digits);
    } catch (error) {
      console.error('❌ Failed to send digits:', error);
      this.onError?.(error);
    }
  }

  // Set event handlers
  onStatusChange(callback: (status: string, call?: any) => void) {
    this.onCallStatusChange = callback;
  }

  onErrorReceived(callback: (error: any) => void) {
    this.onError = callback;
  }

  // Get device status
  isReady(): boolean {
    return this.device !== null && this.token !== null;
  }

  // Get current call
  getCurrentCall(): any {
    return this.currentCall;
  }

  // Cleanup
  destroy() {
    if (this.device) {
      console.log('🧹 Cleaning up Twilio Device');
      this.device.destroy();
      this.device = null;
    }
    this.token = null;
    this.currentCall = null;
  }
}

export default new TwilioService();
