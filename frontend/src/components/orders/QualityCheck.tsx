import React, { useState } from 'react';
import { MdCheckCircle, MdWarning, MdError, MdPhoto, MdSave } from 'react-icons/md';
import type { OrderItem } from '../../models/LaundryOrder';

interface QualityCheckProps {
  orderItem: OrderItem;
  onSaveCheck: (itemId: string, checkData: {
    result: 'pass' | 'minor_issues' | 'fail';
    notes: string;
    photos?: string[];
  }) => void;
}

const QualityCheck: React.FC<QualityCheckProps> = ({
  orderItem,
  onSaveCheck
}) => {
  const [result, setResult] = useState<'pass' | 'minor_issues' | 'fail'>('pass');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you'd upload these to storage and get URLs back
    // This is just a mock implementation
    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
    setPhotos([...photos, ...newPhotos]);
  };

  const handleSave = () => {
    onSaveCheck(orderItem.id, {
      result,
      notes,
      photos
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Quality Check</h3>
      
      <div className="space-y-6">
        {/* Item Details */}
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="font-medium">{orderItem.serviceName}</p>
          <p className="text-sm text-gray-500">{orderItem.garmentType}</p>
          {orderItem.color && <p className="text-sm text-gray-500">Color: {orderItem.color}</p>}
        </div>

        {/* Quality Result */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality Result
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setResult('pass')}
              className={`flex items-center px-4 py-2 rounded-md ${
                result === 'pass'
                  ? 'bg-green-100 text-green-700 border-2 border-green-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <MdCheckCircle className="w-5 h-5 mr-2" />
              Pass
            </button>
            <button
              onClick={() => setResult('minor_issues')}
              className={`flex items-center px-4 py-2 rounded-md ${
                result === 'minor_issues'
                  ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <MdWarning className="w-5 h-5 mr-2" />
              Minor Issues
            </button>
            <button
              onClick={() => setResult('fail')}
              className={`flex items-center px-4 py-2 rounded-md ${
                result === 'fail'
                  ? 'bg-red-100 text-red-700 border-2 border-red-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <MdError className="w-5 h-5 mr-2" />
              Fail
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe any quality issues or special notes..."
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={photo}
                  alt={`Quality check photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <MdPhoto className="w-5 h-5 mr-2" />
            Add Photos
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          <MdSave className="w-5 h-5 mr-2" />
          Save Quality Check
        </button>
      </div>
    </div>
  );
};

export default QualityCheck; 