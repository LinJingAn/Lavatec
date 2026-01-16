import React, { useState } from 'react';
import { MdAdd, MdDelete, MdPlayArrow, MdStop, MdSave } from 'react-icons/md';
import type { OrderItem, BatchProcessing as BatchProcessingType } from '../../models/LaundryOrder';

interface BatchProcessingProps {
  availableOrders: OrderItem[];
  onCreateBatch: (batch: Omit<BatchProcessingType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateBatch: (batchId: string, updates: Partial<BatchProcessingType>) => void;
  existingBatches: BatchProcessingType[];
}

const BatchProcessing: React.FC<BatchProcessingProps> = ({
  availableOrders,
  onCreateBatch,
  onUpdateBatch,
  existingBatches
}) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [batchName, setBatchName] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreateBatch = () => {
    if (!batchName || selectedOrders.length === 0) return;

    onCreateBatch({
      name: batchName,
      items: selectedOrders,
      status: 'pending',
      machineId: selectedMachine || undefined,
      notes: notes || undefined,
    });

    // Reset form
    setSelectedOrders([]);
    setBatchName('');
    setSelectedMachine('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Create New Batch */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Create New Batch</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch Name
            </label>
            <input
              type="text"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter batch name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Orders
            </label>
            <div className="max-h-60 overflow-y-auto border rounded-md">
              {availableOrders.map((order) => (
                <label
                  key={order.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders([...selectedOrders, order.id]);
                      } else {
                        setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="ml-3">{order.serviceName} - {order.garmentType}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Machine (Optional)
            </label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a machine...</option>
              <option value="machine1">Washer 1</option>
              <option value="machine2">Washer 2</option>
              <option value="machine3">Dryer 1</option>
              <option value="machine4">Dryer 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add any notes about this batch..."
            />
          </div>

          <button
            onClick={handleCreateBatch}
            disabled={!batchName || selectedOrders.length === 0}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Create Batch
          </button>
        </div>
      </div>

      {/* Existing Batches */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Active Batches</h3>
        
        <div className="space-y-4">
          {existingBatches.map((batch) => (
            <div key={batch.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{batch.name}</h4>
                <div className="flex space-x-2">
                  {batch.status === 'pending' && (
                    <button
                      onClick={() => onUpdateBatch(batch.id, { status: 'in_progress', startTime: new Date() })}
                      className="text-green-600 hover:text-green-700"
                      title="Start Processing"
                    >
                      <MdPlayArrow className="w-5 h-5" />
                    </button>
                  )}
                  {batch.status === 'in_progress' && (
                    <button
                      onClick={() => onUpdateBatch(batch.id, { status: 'completed', endTime: new Date() })}
                      className="text-red-600 hover:text-red-700"
                      title="Complete Batch"
                    >
                      <MdStop className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Items: {batch.items.length}</p>
                {batch.machineName && <p>Machine: {batch.machineName}</p>}
                <p>Status: {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchProcessing; 