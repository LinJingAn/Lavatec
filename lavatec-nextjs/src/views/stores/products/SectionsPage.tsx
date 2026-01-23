import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdDragIndicator } from 'react-icons/md';

interface Section {
  id: string;
  name: string;
  description: string;
  active: boolean;
  serviceType: string;
  order: number;
}

const SectionsPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      name: 'Shirts & Tops',
      description: 'All types of shirts, blouses, and tops',
      active: true,
      serviceType: 'Dry Cleaning',
      order: 1
    },
    {
      id: '2',
      name: 'Pants & Bottoms',
      description: 'Trousers, jeans, skirts, and shorts',
      active: true,
      serviceType: 'Dry Cleaning',
      order: 2
    },
    {
      id: '3',
      name: 'Dresses & Formal',
      description: 'Dresses, evening wear, and formal attire',
      active: true,
      serviceType: 'Dry Cleaning',
      order: 3
    },
    {
      id: '4',
      name: 'Outerwear',
      description: 'Jackets, coats, and overcoats',
      active: true,
      serviceType: 'Dry Cleaning',
      order: 4
    },
    {
      id: '5',
      name: 'Household',
      description: 'Bedding, curtains, and household textiles',
      active: true,
      serviceType: 'Laundry',
      order: 5
    }
  ]);

  const deleteSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const toggleActive = (id: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, active: !section.active } : section
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sections</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
          <MdAdd className="mr-1" />
          Add Section
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.map((section) => (
              <tr key={section.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <MdDragIndicator className="text-gray-400 cursor-move" size={20} />
                    <span className="ml-2">{section.order}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {section.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {section.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {section.serviceType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={section.active}
                      onChange={() => toggleActive(section.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <MdEdit size={20} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteSection(section.id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Managing Sections</h2>
        <p className="text-gray-600 mb-3">
          Sections help organize your products into logical groups for easier navigation and management.
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Drag and drop to reorder sections as they will appear to customers</li>
          <li>Each section can be assigned to a specific service type</li>
          <li>Inactive sections will not be visible to customers</li>
          <li>Sections can contain multiple products</li>
        </ul>
      </div>
    </div>
  );
};

export default SectionsPage; 