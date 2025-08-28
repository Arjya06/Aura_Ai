
import React from 'react';
import { RawEvent, EventType } from '../types';

const EventIcon: React.FC<{ type: EventType }> = ({ type }) => {
  switch (type) {
    case EventType.TYPING:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
        </svg>
      );
    case EventType.SWIPE:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case EventType.MOUSE_MOVE:
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l5-2 2 8z" />
            </svg>
        )
    default:
      return null;
  }
};


const EventStream: React.FC<{ events: RawEvent[] }> = ({ events }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-sentinel-light-gray mb-4">Live Event Stream</h3>
      <div className="h-full overflow-y-auto pr-2 rounded-md bg-sentinel-blue-deep p-2">
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event.id}
              className={`flex items-center space-x-3 p-2 rounded transition-all duration-300 ${
                event.isAnomalous ? 'bg-red-900/50' : 'bg-sentinel-blue-light/50'
              }`}
            >
              <div className={`p-1.5 rounded-full ${event.isAnomalous ? 'bg-red-500/30 text-red-300' : 'bg-sentinel-cyan/20 text-sentinel-cyan'}`}>
                 <EventIcon type={event.type} />
              </div>
              <div className="flex-grow">
                 <p className="text-sm font-medium text-sentinel-light-gray">{event.type}</p>
                 <p className="text-xs text-sentinel-gray">{`Location: ${event.contextual.location} | Time: ${event.contextual.timeOfDay}`}</p>
              </div>
              <span className="text-xs text-sentinel-gray">{new Date(event.timestamp).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventStream;
