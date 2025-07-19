"use client";

import { useState, useEffect } from "react";
import { X, Phone, UserPlus, Edit3, Trash2, Search, PhoneOff, Mic, MicOff, Volume2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  _id?: string;
  name: string;
  phone: string;
  notes?: string;
  tags?: string[];
}

interface ModernDialerProps {
  isOpen: boolean;
  onClose: () => void;
  onCall: (number: string, name?: string) => void;
}

export default function ModernDialer({ isOpen, onClose, onCall }: ModernDialerProps) {
  const [dialNumber, setDialNumber] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({ name: "", phone: "", notes: "" });
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentCallNumber, setCurrentCallNumber] = useState("");
  const [currentCallName, setCurrentCallName] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState<"ringing" | "connected" | "disconnected">("ringing");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  // Call duration timer and auto-disconnect logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      if (callStatus === "ringing") {
        // Auto-disconnect after 15 seconds of ringing
        const timeout = setTimeout(() => {
          setCallStatus("disconnected");
          setTimeout(() => {
            handleEndCall();
          }, 2000); // Show disconnected state for 2 seconds before closing
        }, 15000);

        return () => {
          clearTimeout(timeout);
        };
      } else if (callStatus === "connected") {
        // Start call duration timer when connected
        interval = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      }
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive, callStatus]);

  const fetchContacts = async () => {
    try {
      const response = await api.get("/auth/me");
      const contacts = response.data.data?.user?.contacts || [];
      setContacts(contacts);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  const handleDialPad = (digit: string) => {
    if (digit === "0" && dialNumber === "") {
      // If first digit is 0, replace with +
      setDialNumber("+");
    } else {
      setDialNumber(prev => prev + digit);
    }
  };

  const validateAndFormatPhone = (phone: string) => {
    // Remove any non-digit characters except +
    let cleaned = phone.replace(/[^+\d]/g, '');
    
    // If it doesn't start with +, add +92 (Pakistan) as default
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('0')) {
        // Replace leading 0 with +92
        cleaned = '+92' + cleaned.substring(1);
      } else if (cleaned.length > 0) {
        // Add +92 prefix
        cleaned = '+92' + cleaned;
      }
    }
    
    return cleaned;
  };

  const handlePhoneNumberChange = (value: string) => {
    const formatted = validateAndFormatPhone(value);
    setDialNumber(formatted);
  };

  const handleBackspace = () => {
    setDialNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialNumber) {
      setCurrentCallNumber(dialNumber);
      setCurrentCallName("Unknown Contact");
      setCallStatus("ringing");
      setIsCallActive(true);
      onCall(dialNumber);
    }
  };

  const handleContactCall = (phone: string, name: string) => {
    setDialNumber(phone);
    setCurrentCallNumber(phone);
    setCurrentCallName(name);
    setCallStatus("ringing");
    setIsCallActive(true);
    onCall(phone, name);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCurrentCallNumber("");
    setCurrentCallName("");
    setCallDuration(0);
    setIsMuted(false);
    setCallStatus("ringing");
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveContact = async () => {
    try {
      const contactData = editingContact 
        ? { ...newContact, _id: editingContact._id }
        : newContact;

      if (editingContact) {
        await api.put(`/auth/contacts/${editingContact._id}`, contactData);
        toast({ title: "Contact updated successfully!" });
      } else {
        await api.post("/auth/contacts", contactData);
        toast({ title: "Contact added successfully!" });
      }
      
      fetchContacts();
      setIsAddContactOpen(false);
      setEditingContact(null);
      setNewContact({ name: "", phone: "", notes: "" });
    } catch (error) {
      toast({ 
        title: "Error saving contact", 
        variant: "destructive" 
      });
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      await api.delete(`/auth/contacts/${contactId}`);
      toast({ title: "Contact deleted successfully!" });
      fetchContacts();
    } catch (error) {
      toast({ 
        title: "Error deleting contact", 
        variant: "destructive" 
      });
    }
  };

  const startEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({ name: contact.name, phone: contact.phone, notes: contact.notes || "" });
    setIsAddContactOpen(true);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const dialPadKeys = [
    [{ digit: "1", letters: "" }, { digit: "2", letters: "ABC" }, { digit: "3", letters: "DEF" }],
    [{ digit: "4", letters: "GHI" }, { digit: "5", letters: "JKL" }, { digit: "6", letters: "MNO" }],
    [{ digit: "7", letters: "PQRS" }, { digit: "8", letters: "TUV" }, { digit: "9", letters: "WXYZ" }],
    [{ digit: "*", letters: "" }, { digit: "0", letters: "+" }, { digit: "#", letters: "" }]
  ];

  if (!isOpen) return null;

  // Show call modal when call is active
  if (isCallActive) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-700 overflow-hidden">
          {/* Call Header */}
          <div className={`p-8 text-center ${
            callStatus === "ringing" ? "bg-gradient-to-r from-blue-600 to-purple-600" :
            callStatus === "connected" ? "bg-gradient-to-r from-green-600 to-blue-600" :
            "bg-gradient-to-r from-red-600 to-gray-600"
          }`}>
            {/* Profile Image Placeholder */}
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {currentCallName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-2">{currentCallName}</h2>
            <p className={`text-lg mb-4 ${
              callStatus === "ringing" ? "text-blue-100" :
              callStatus === "connected" ? "text-green-100" :
              "text-red-100"
            }`}>{currentCallNumber}</p>
            
            {/* Call Status */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${
                callStatus === "ringing" ? "bg-blue-400 animate-pulse" :
                callStatus === "connected" ? "bg-green-400 animate-pulse" :
                "bg-red-400"
              }`}></div>
              <span className="text-white text-lg font-medium">
                {callStatus === "ringing" ? "Awaiting..." :
                 callStatus === "connected" ? "Connected" :
                 "Call Ended"}
              </span>
            </div>
            
            {/* Call Duration - only show when connected */}
            {callStatus === "connected" && (
              <div className="flex items-center justify-center gap-2 text-green-100">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-mono">{formatDuration(callDuration)}</span>
              </div>
            )}

            {/* Ringing indicator */}
            {callStatus === "ringing" && (
              <div className="flex items-center justify-center gap-2 text-blue-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Ringing...</span>
              </div>
            )}

            {/* Disconnected message */}
            {callStatus === "disconnected" && (
              <div className="text-red-100 text-sm">
                No answer - Call ended
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="p-8">
            <div className="flex justify-center gap-6">
              {/* Mute Button - only show when connected */}
              {callStatus === "connected" && (
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-16 h-16 rounded-full ${
                    isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                  } transition-all duration-200`}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
              )}
              
              {/* Speaker Button - only show when connected */}
              {callStatus === "connected" && (
                <Button
                  onClick={() => {}} // Placeholder for speaker functionality
                  className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
              )}
              
              {/* End Call Button - always show unless disconnected */}
              {callStatus !== "disconnected" && (
                <Button
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200"
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden border border-gray-700">
        <div className="flex h-[600px]">
          {/* Left Side - Dialer */}
          <div className="flex-1 p-6 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Make a Call</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Phone Number Display */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border-2 border-gray-600 shadow-inner">
              {/* <div className="text-center mb-2">
                <span className="text-sm text-gray-400 font-medium">Phone Number</span>
              </div> */}
              <Input
                type="text"
                value={dialNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                placeholder="Enter phone number"
                className="text-3l text-center bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 focus:outline-none font-mono tracking-wider"
                style={{ fontSize: '2rem', letterSpacing: '0.1em' }}
              />
              {/* {dialNumber && (
                <div className="text-center mt-2">
                  <span className="text-xs text-green-400 font-medium">Ready to call</span>
                </div>
              )} */}
            </div>

            {/* Dial Pad */}
            <div className="grid grid-cols-3 gap-4 mb-4 flex-grow">
              {dialPadKeys.map((row, rowIndex) =>
                row.map((key) => (
                  <Button
                    key={key.digit}
                    onClick={() => handleDialPad(key.digit)}
                    className="h-16 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl flex flex-col items-center justify-center text-white"
                  >
                    <span className="text-2xl font-bold">{key.digit}</span>
                    {key.letters && (
                      <span className="text-xs text-gray-400 mt-1">{key.letters}</span>
                    )}
                  </Button>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              <Button
                onClick={handleBackspace}
                variant="outline"
                className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700 py-3"
              >
                ← Backspace
              </Button>
              <Button
                onClick={handleCall}
                disabled={!dialNumber}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call
              </Button>
            </div>
          </div>

          {/* Right Side - Contacts */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Contacts Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Contacts</h3>
                <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setEditingContact(null);
                        setNewContact({ name: "", phone: "", notes: "" });
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        {editingContact ? "Edit Contact" : "Add New Contact"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-300">Name</Label>
                        <Input
                          id="name"
                          value={newContact.name}
                          onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                        <Input
                          id="phone"
                          value={newContact.phone}
                          onChange={(e) => setNewContact(prev => ({ ...prev, phone: validateAndFormatPhone(e.target.value) }))}
                          placeholder="+92..."
                          className="bg-gray-800 border-gray-600 text-white font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                        <Textarea
                          id="notes"
                          value={newContact.notes}
                          onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={saveContact}
                          disabled={!newContact.name || !newContact.phone}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {editingContact ? "Update" : "Add"} Contact
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddContactOpen(false)}
                          className="border-gray-600 text-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredContacts.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No contacts found</p>
                  <p className="text-sm">
                    {contacts.length === 0 
                      ? "Add your first contact to get started" 
                      : `No matches for "${searchTerm}"`
                    }
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{contact.name}</h4>
                        <p className="text-gray-300 text-sm">{contact.phone}</p>
                        {contact.notes && (
                          <p className="text-gray-400 text-xs mt-1 truncate">{contact.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContactCall(contact.phone, contact.name)}
                          className="text-green-400 hover:text-green-300 hover:bg-gray-600 p-1 h-8 w-8"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditContact(contact)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-gray-600 p-1 h-8 w-8"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => contact._id && deleteContact(contact._id)}
                          className="text-red-400 hover:text-red-300 hover:bg-gray-600 p-1 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
