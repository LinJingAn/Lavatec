import React from 'react';
import { OrderStatus, getStatusLabel } from '@/models/LaundryOrder';
import { Clock, Check, AlertCircle } from 'lucide-react';

interface TimelineEvent {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  user?: string;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ events, className = '' }) => {
  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className={`flow-root ${className}`}>
      <ul className="-mb-8">
        {sortedEvents.map((event, eventIdx) => (
          <li key={eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== sortedEvents.length - 1 && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-50">
                    {getStatusIcon(event.status)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      {getStatusLabel(event.status)}
                      {event.user && <span className="ml-2 text-gray-500 text-xs">por {event.user}</span>}
                    </p>
                    {event.note && (
                      <p className="mt-0.5 text-sm text-gray-500">{event.note}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {formatDate(event.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderTimeline; 