import React, { useState } from 'react';
import { 
  MdDone, 
  MdAssignmentInd, 
  MdWaterDrop, 
  MdOutlineLocalLaundryService, 
  MdDryCleaning,
  MdIron,
  MdAssignment,
  MdFactCheck,
  MdLocalShipping,
  MdNotifications,
  MdTimer,
  MdWarning,
  MdAdd,
  MdPerson,
  MdSettings
} from 'react-icons/md';
import { LaundryOrder, OrderStatus, generateBatchId } from '../../models/LaundryOrder';

interface OrderProcessingWorkflowProps {
  order: LaundryOrder;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
  onAssignStaff: (orderId: string, staffId: string, staffName: string) => void;
  onAddToBatch: (orderId: string, batchId: string, batchName: string) => void;
  onRecordQualityCheck: (orderId: string, passed: boolean, notes?: string) => void;
  onSendNotification: (orderId: string, type: string, message: string) => void;
  staffList?: Array<{ id: string, name: string }>;
  machinesList?: Array<{ id: string, name: string, type: string }>;
}

// Sample staff and machines data
const SAMPLE_STAFF = [
  { id: 'staff-1', name: 'Maria Silva' },
  { id: 'staff-2', name: 'João Santos' },
  { id: 'staff-3', name: 'Ana Oliveira' },
  { id: 'staff-4', name: 'Carlos Lima' }
];

const SAMPLE_MACHINES = [
  { id: 'machine-1', name: 'Washer 1', type: 'washer' },
  { id: 'machine-2', name: 'Washer 2', type: 'washer' },
  { id: 'machine-3', name: 'Dryer 1', type: 'dryer' },
  { id: 'machine-4', name: 'Dryer 2', type: 'dryer' },
  { id: 'machine-5', name: 'Press 1', type: 'press' }
];

const SAMPLE_BATCHES = [
  { id: 'batch-1', name: 'Morning Wash', status: 'in_progress' },
  { id: 'batch-2', name: 'Afternoon Dry', status: 'pending' },
  { id: 'batch-3', name: 'Evening Press', status: 'completed' }
];

// Status display helper
interface StatusStepProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: () => void;
  isClickable?: boolean;
}

const StatusStep: React.FC<StatusStepProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  isActive, 
  isCompleted, 
  onClick,
  isClickable = true
}) => {
  const getBgColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (isActive) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  return (
    <div className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : ''}`} onClick={isClickable ? onClick : undefined}>
      <div className={`${getBgColor()} rounded-full h-12 w-12 flex items-center justify-center text-white mb-2`}>
        {isCompleted ? <MdDone size={24} /> : <Icon size={24} />}
      </div>
      <div className="text-center">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </div>
  );
};

const OrderProcessingWorkflow: React.FC<OrderProcessingWorkflowProps> = ({ 
  order, 
  onStatusUpdate, 
  onAssignStaff,
  onAddToBatch,
  onRecordQualityCheck,
  onSendNotification,
  staffList = SAMPLE_STAFF,
  machinesList = SAMPLE_MACHINES
}) => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>(order.status);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [actionType, setActionType] = useState<
    'status' | 'assignment' | 'batch' | 'quality' | 'notification'
  >('status');
  
  // States for various actions
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedBatchAction, setSelectedBatchAction] = useState<'add' | 'create'>('add');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [newBatchName, setNewBatchName] = useState('');
  const [qualityCheckPassed, setQualityCheckPassed] = useState(true);
  const [notes, setNotes] = useState('');
  const [notificationType, setNotificationType] = useState('status_update');
  
  // Calculate status completion information
  const isStatusCompleted = (status: OrderStatus): boolean => {
    const statusOrder: OrderStatus[] = ['new', 'received', 'processing', 'quality_check', 'ready', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);
    const statusIndex = statusOrder.indexOf(status);
    return currentIndex > statusIndex;
  };
  
  // Handle showing action panel for a specific task
  const handleShowAction = (action: 'status' | 'assignment' | 'batch' | 'quality' | 'notification') => {
    setActionType(action);
    setShowActionPanel(true);
    
    // Reset states
    setNotes('');
    setSelectedStaffId('');
    setSelectedBatchId('');
    setNewBatchName('');
    setQualityCheckPassed(true);
  };
  
  // Handle submitting the current action
  const handleSubmitAction = () => {
    switch (actionType) {
      case 'status':
        onStatusUpdate(order.id, activeStatus, notes);
        break;
      case 'assignment':
        if (selectedStaffId) {
          const staff = staffList.find(s => s.id === selectedStaffId);
          if (staff) {
            onAssignStaff(order.id, staff.id, staff.name);
          }
        }
        break;
      case 'batch':
        if (selectedBatchAction === 'add' && selectedBatchId) {
          const batch = SAMPLE_BATCHES.find(b => b.id === selectedBatchId);
          if (batch) {
            onAddToBatch(order.id, batch.id, batch.name);
          }
        } else if (selectedBatchAction === 'create' && newBatchName) {
          const newBatchId = generateBatchId();
          onAddToBatch(order.id, newBatchId, newBatchName);
        }
        break;
      case 'quality':
        onRecordQualityCheck(order.id, qualityCheckPassed, notes);
        break;
      case 'notification':
        onSendNotification(order.id, notificationType, notes);
        break;
    }
    
    setShowActionPanel(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-6">Order Processing Workflow</h2>
      
      {/* Workflow progress visualization */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">Current Status: <span className="text-blue-600">{order.status}</span></h3>
          
          {order.assignedStaffName && (
            <div className="flex items-center text-sm">
              <MdPerson className="text-gray-500 mr-1" />
              <span>Assigned to: <span className="font-medium">{order.assignedStaffName}</span></span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-6 gap-4">
          <StatusStep 
            title="New" 
            description="Order created" 
            icon={MdAssignment} 
            isActive={activeStatus === 'new'} 
            isCompleted={isStatusCompleted('new')}
            onClick={() => setActiveStatus('new')}
          />
          <StatusStep 
            title="Received" 
            description="Items received" 
            icon={MdAssignmentInd} 
            isActive={activeStatus === 'received'} 
            isCompleted={isStatusCompleted('received')}
            onClick={() => setActiveStatus('received')}
          />
          <StatusStep 
            title="Processing" 
            description="In cleaning process" 
            icon={MdOutlineLocalLaundryService} 
            isActive={activeStatus === 'processing'} 
            isCompleted={isStatusCompleted('processing')}
            onClick={() => setActiveStatus('processing')}
          />
          <StatusStep 
            title="Quality Check" 
            description="Quality verification" 
            icon={MdFactCheck} 
            isActive={activeStatus === 'quality_check'} 
            isCompleted={isStatusCompleted('quality_check')}
            onClick={() => setActiveStatus('quality_check')}
          />
          <StatusStep 
            title="Ready" 
            description="Ready for pickup" 
            icon={MdDone} 
            isActive={activeStatus === 'ready'} 
            isCompleted={isStatusCompleted('ready')}
            onClick={() => setActiveStatus('ready')}
          />
          <StatusStep 
            title="Delivered" 
            description="Picked up by customer" 
            icon={MdLocalShipping} 
            isActive={activeStatus === 'delivered'} 
            isCompleted={isStatusCompleted('delivered')}
            onClick={() => setActiveStatus('delivered')}
          />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
          onClick={() => handleShowAction('status')}
        >
          <MdAssignment className="mr-1" />
          <span>Update Status</span>
        </button>
        
        <button 
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded flex items-center justify-center"
          onClick={() => handleShowAction('assignment')}
        >
          <MdAssignmentInd className="mr-1" />
          <span>Assign Staff</span>
        </button>
        
        <button 
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded flex items-center justify-center"
          onClick={() => handleShowAction('batch')}
        >
          <MdOutlineLocalLaundryService className="mr-1" />
          <span>Batch Processing</span>
        </button>
        
        <button 
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center"
          onClick={() => handleShowAction('quality')}
        >
          <MdFactCheck className="mr-1" />
          <span>Quality Check</span>
        </button>
        
        <button 
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded flex items-center justify-center"
          onClick={() => handleShowAction('notification')}
        >
          <MdNotifications className="mr-1" />
          <span>Send Notification</span>
        </button>
      </div>
      
      {/* Order processing details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batch & Timing Information */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <MdOutlineLocalLaundryService className="mr-1 text-gray-600" />
            <span>Processing Details</span>
          </h3>
          
          <div className="mb-3">
            <div className="text-sm text-gray-500">Batch:</div>
            {order.batchName ? (
              <div className="text-sm font-medium">{order.batchName}</div>
            ) : (
              <div className="text-sm text-gray-400 italic">Not assigned to a batch</div>
            )}
          </div>
          
          <div className="mb-3">
            <div className="text-sm text-gray-500">Estimated Processing Time:</div>
            {order.processTiming?.estimatedProcessingTime ? (
              <div className="text-sm font-medium">{order.processTiming.estimatedProcessingTime} minutes</div>
            ) : (
              <div className="text-sm text-gray-400 italic">Not estimated</div>
            )}
          </div>
          
          {order.processTiming?.startTime && (
            <div className="mb-3">
              <div className="text-sm text-gray-500">Process Start:</div>
              <div className="text-sm font-medium">
                {new Date(order.processTiming.startTime).toLocaleString()}
              </div>
            </div>
          )}
          
          {order.processTiming?.scheduledEndTime && (
            <div className="mb-3">
              <div className="text-sm text-gray-500">Scheduled Completion:</div>
              <div className="text-sm font-medium">
                {new Date(order.processTiming.scheduledEndTime).toLocaleString()}
              </div>
            </div>
          )}
          
          {order.processTiming?.hasDelay && order.processTiming?.delayMinutes && (
            <div className="flex items-start space-x-1 text-amber-600 bg-amber-50 p-2 rounded">
              <MdWarning className="mt-0.5" />
              <div className="text-sm">
                <span className="font-medium">Delayed by {order.processTiming.delayMinutes} minutes.</span>
                {order.processTiming.delayReason && (
                  <div className="text-xs">{order.processTiming.delayReason}</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Staff Assignment & Quality Check */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <MdAssignmentInd className="mr-1 text-gray-600" />
            <span>Staff & Quality Check</span>
          </h3>
          
          <div className="mb-3">
            <div className="text-sm text-gray-500">Assigned To:</div>
            {order.assignedStaffName ? (
              <div className="text-sm font-medium">{order.assignedStaffName}</div>
            ) : (
              <div className="text-sm text-gray-400 italic">Not assigned</div>
            )}
          </div>
          
          <div className="mb-3">
            <div className="text-sm text-gray-500">Quality Check:</div>
            {order.qualityCheck ? (
              <div className={`text-sm font-medium ${order.qualityCheck.passed ? 'text-green-600' : 'text-red-600'}`}>
                {order.qualityCheck.passed ? 'Passed' : 'Failed'} - Checked by {order.qualityCheck.checkedByName}
              </div>
            ) : (
              <div className="text-sm text-gray-400 italic">Not checked yet</div>
            )}
          </div>
          
          {order.qualityCheck?.notes && (
            <div className="mb-3">
              <div className="text-sm text-gray-500">Quality Notes:</div>
              <div className="text-sm bg-gray-50 p-2 rounded">
                {order.qualityCheck.notes}
              </div>
            </div>
          )}
          
          {order.lastNotification && (
            <div className="mt-4 bg-blue-50 p-2 rounded">
              <div className="text-sm text-gray-700 flex items-center">
                <MdNotifications className="text-blue-500 mr-1" />
                <span>Last notification sent: {new Date(order.lastNotification.sentAt).toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {order.lastNotification.type}: {order.lastNotification.message.substring(0, 50)}
                {order.lastNotification.message.length > 50 ? '...' : ''}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Panel */}
      {showActionPanel && (
        <div className="mt-6 border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">
              {actionType === 'status' && 'Update Order Status'}
              {actionType === 'assignment' && 'Assign Staff'}
              {actionType === 'batch' && 'Batch Processing'}
              {actionType === 'quality' && 'Quality Check'}
              {actionType === 'notification' && 'Send Notification'}
            </h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowActionPanel(false)}
            >
              ✕
            </button>
          </div>
          
          {/* Status Update Panel */}
          {actionType === 'status' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value as OrderStatus)}
                >
                  <option value="new">New</option>
                  <option value="received">Received</option>
                  <option value="processing">Processing</option>
                  <option value="quality_check">Quality Check</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this status change..."
                />
              </div>
            </div>
          )}
          
          {/* Staff Assignment Panel */}
          {actionType === 'assignment' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Staff Member
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                >
                  <option value="">Select a staff member</option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Notes (Optional)
                </label>
                <textarea
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this assignment..."
                />
              </div>
            </div>
          )}
          
          {/* Batch Processing Panel */}
          {actionType === 'batch' && (
            <div>
              <div className="mb-4">
                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center">
                    <input
                      id="add-to-batch"
                      type="radio"
                      value="add"
                      checked={selectedBatchAction === 'add'}
                      onChange={() => setSelectedBatchAction('add')}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="add-to-batch" className="ml-2 block text-sm text-gray-700">
                      Add to existing batch
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="create-new-batch"
                      type="radio"
                      value="create"
                      checked={selectedBatchAction === 'create'}
                      onChange={() => setSelectedBatchAction('create')}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="create-new-batch" className="ml-2 block text-sm text-gray-700">
                      Create new batch
                    </label>
                  </div>
                </div>
              
                {selectedBatchAction === 'add' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Batch
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                    >
                      <option value="">Select a batch</option>
                      {SAMPLE_BATCHES.map(batch => (
                        <option key={batch.id} value={batch.id}>{batch.name} ({batch.status})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Batch Name
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={newBatchName}
                      onChange={(e) => setNewBatchName(e.target.value)}
                      placeholder="Enter batch name..."
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Notes (Optional)
                </label>
                <textarea
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this batch..."
                />
              </div>
            </div>
          )}
          
          {/* Quality Check Panel */}
          {actionType === 'quality' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality Check Result
                </label>
                <div className="flex space-x-4 mb-2">
                  <div className="flex items-center">
                    <input
                      id="quality-passed"
                      type="radio"
                      checked={qualityCheckPassed}
                      onChange={() => setQualityCheckPassed(true)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="quality-passed" className="ml-2 block text-sm text-gray-700">
                      Passed
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="quality-failed"
                      type="radio"
                      checked={!qualityCheckPassed}
                      onChange={() => setQualityCheckPassed(false)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="quality-failed" className="ml-2 block text-sm text-gray-700">
                      Failed
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality Check Notes
                </label>
                <textarea
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add details about the quality check..."
                />
              </div>
            </div>
          )}
          
          {/* Notification Panel */}
          {actionType === 'notification' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Type
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                >
                  <option value="status_update">Status Update</option>
                  <option value="delay_notification">Delay Notification</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                  <option value="quality_issue">Quality Issue</option>
                  <option value="custom">Custom Message</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter the notification message..."
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowActionPanel(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitAction}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={
                (actionType === 'assignment' && !selectedStaffId) ||
                (actionType === 'batch' && selectedBatchAction === 'add' && !selectedBatchId) ||
                (actionType === 'batch' && selectedBatchAction === 'create' && !newBatchName) ||
                (actionType === 'notification' && !notes)
              }
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderProcessingWorkflow; 