import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdFileUpload, MdImage } from 'react-icons/md';

interface CustomIcon {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  dateAdded: string;
  inUse: boolean;
}

const CustomIconsPage: React.FC = () => {
  const [icons, setIcons] = useState<CustomIcon[]>([
    {
      id: '1',
      name: 'Shirt Blue',
      category: 'Tops',
      imageUrl: '/images/icons/shirt-blue.png',
      dateAdded: '2023-05-15',
      inUse: true
    },
    {
      id: '2',
      name: 'Dress Formal',
      category: 'Dresses',
      imageUrl: '/images/icons/dress-formal.png',
      dateAdded: '2023-05-15',
      inUse: true
    },
    {
      id: '3',
      name: 'Jacket Leather',
      category: 'Outerwear',
      imageUrl: '/images/icons/jacket-leather.png',
      dateAdded: '2023-06-20',
      inUse: true
    },
    {
      id: '4',
      name: 'Pants Jeans',
      category: 'Bottoms',
      imageUrl: '/images/icons/pants-jeans.png',
      dateAdded: '2023-07-05',
      inUse: true
    },
    {
      id: '5',
      name: 'Suit Set',
      category: 'Formal',
      imageUrl: '/images/icons/suit-set.png',
      dateAdded: '2023-08-12',
      inUse: false
    }
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const deleteIcon = (id: string) => {
    setIcons(icons.filter(icon => icon.id !== id));
  };

  const categories = ['all', ...Array.from(new Set(icons.map(icon => icon.category)))];

  const filteredIcons = filterCategory === 'all' 
    ? icons 
    : icons.filter(icon => icon.category === filterCategory);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Custom Product Icons</h1>
        <div className="flex space-x-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 text-sm leading-5 bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setShowUploadModal(true)}
          >
            <MdAdd className="mr-1" />
            Add Icon
          </button>
        </div>
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredIcons.map((icon) => (
          <div key={icon.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 flex justify-center bg-gray-50">
              <img 
                src={icon.imageUrl} 
                alt={icon.name} 
                className="h-24 w-24 object-contain"
                onError={(e) => {
                  // Fallback for broken images
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=No+Image';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{icon.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Category: {icon.category}</p>
              <p className="text-xs text-gray-400 mb-3">Added: {new Date(icon.dateAdded).toLocaleDateString()}</p>
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${icon.inUse ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {icon.inUse ? 'In Use' : 'Not Used'}
                </span>
                <div className="flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <MdEdit size={18} />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteIcon(icon.id)}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* "Add Icon" Card */}
        <div 
          className="bg-white rounded-lg shadow overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50"
          onClick={() => setShowUploadModal(true)}
        >
          <MdImage className="text-gray-400 mb-2" size={40} />
          <p className="text-sm text-gray-500 font-medium">Add New Icon</p>
          <p className="text-xs text-gray-400 text-center mt-1">
            Upload custom product icons
          </p>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload New Icon</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowUploadModal(false)}
                >
                  <MdDelete size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon Name
                  </label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="E.g., Silk Dress"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="new">+ Add New Category</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Icon
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <MdFileUpload className="mx-auto text-gray-400" size={30} />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, SVG up to 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Tips for Custom Icons</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>Use transparent PNG files for best results</li>
          <li>Keep icons simple and recognizable</li>
          <li>Recommended size: 96x96 pixels</li>
          <li>Organize icons by categories for easier management</li>
          <li>Icons can be assigned to products in the Product Editing page</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomIconsPage; 