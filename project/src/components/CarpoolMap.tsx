import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { usePantryStore } from '../store/pantryStore';
import { Users, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

export function CarpoolMap() {
  const { carpoolEvents, joinCarpoolEvent } = usePantryStore();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const handleJoinCarpool = (eventId: string) => {
    joinCarpoolEvent(eventId, 'Current User'); // In a real app, get from auth
    setSelectedEvent(null);
  };

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Active Carpools</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>Full</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          {carpoolEvents.map((event) => {
            const isFull = event.participants.length >= event.maxParticipants;
            return (
              <React.Fragment key={event.id}>
                <Marker
                  position={event.location}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: isFull ? '#EF4444' : '#10B981',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                  }}
                  onClick={() => setSelectedEvent(event.id)}
                />
                
                {selectedEvent === event.id && (
                  <InfoWindow
                    position={event.location}
                    onCloseClick={() => setSelectedEvent(null)}
                  >
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-blue-600 mr-1" />
                          <span className="font-medium">
                            {event.participants.length}/{event.maxParticipants} joined
                          </span>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded ${
                          isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isFull ? 'Full' : 'Available'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{format(event.date, 'MMM d, h:mm a')}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location.address}</span>
                        </div>
                      </div>
                      
                      {!isFull && !event.participants.includes('Current User') && (
                        <button
                          onClick={() => handleJoinCarpool(event.id)}
                          className="w-full bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Join Carpool
                        </button>
                      )}
                      
                      {event.participants.includes('Current User') && (
                        <div className="text-center text-sm text-green-600">
                          You're part of this carpool!
                        </div>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            );
          })}
        </GoogleMap>
      </div>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Upcoming Carpools</h3>
        <div className="space-y-2">
          {carpoolEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">No active carpools at the moment</p>
          ) : (
            carpoolEvents.map((event) => {
              const isFull = event.participants.length >= event.maxParticipants;
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedEvent(event.id)}
                >
                  <div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-600 mr-1" />
                      <span className="text-sm">{format(event.date, 'MMM d, h:mm a')}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Users className="h-4 w-4 text-gray-600 mr-1" />
                      <span className="text-sm text-gray-600">
                        {event.participants.length}/{event.maxParticipants} participants
                      </span>
                    </div>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {isFull ? 'Full' : 'Available'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}