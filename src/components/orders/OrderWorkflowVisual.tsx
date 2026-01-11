import React from 'react';
import { MdCheckCircle, MdPending, MdLocalLaundryService, MdAssignment, MdVerified, MdLocalShipping } from 'react-icons/md';
import type { OrderStatus } from '../../models/LaundryOrder';

interface OrderWorkflowVisualProps {
  currentStatus: OrderStatus;
  onStatusUpdate: (newStatus: OrderStatus) => void;
  isEditable?: boolean;
}

const workflowSteps = [
  { status: 'received', icon: MdPending, label: 'Received' },
  { status: 'processing', icon: MdLocalLaundryService, label: 'In Process' },
  { status: 'quality_check', icon: MdVerified, label: 'Quality Check' },
  { status: 'ready', icon: MdCheckCircle, label: 'Ready' },
  { status: 'delivered', icon: MdLocalShipping, label: 'Delivered' }
] as const;

const OrderWorkflowVisual: React.FC<OrderWorkflowVisualProps> = ({
  currentStatus,
  onStatusUpdate,
  isEditable = false
}) => {
  const currentStepIndex = workflowSteps.findIndex(step => step.status === currentStatus);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = step.status === currentStatus;
          
          return (
            <React.Fragment key={step.status}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isEditable ? 'cursor-pointer' : 'cursor-default'
                  } ${
                    isCurrent
                      ? 'bg-blue-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                  onClick={() => isEditable && onStatusUpdate(step.status as OrderStatus)}
                  disabled={!isEditable}
                >
                  <Icon className="w-6 h-6" />
                </button>
                <span className={`mt-2 text-sm ${isCurrent ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
              
              {/* Connector line */}
              {index < workflowSteps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div
                    className={`h-1 ${
                      index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderWorkflowVisual; 