import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdContentCopy, MdCheck } from 'react-icons/md';
import type { InvoiceTemplate } from '../../models/Invoice';

interface TemplateManagerProps {
  templates: InvoiceTemplate[];
  onCreateTemplate: (template: Omit<InvoiceTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTemplate: (id: string, updates: Partial<InvoiceTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
  onSetDefaultTemplate: (id: string) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onSetDefaultTemplate
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<InvoiceTemplate>>({});
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<InvoiceTemplate, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    content: defaultTemplateContent,
    styles: defaultTemplateStyles,
    isDefault: false
  });

  const handleSaveEdit = (id: string) => {
    onUpdateTemplate(id, editForm);
    setIsEditing(null);
    setEditForm({});
  };

  const handleCreateTemplate = () => {
    onCreateTemplate(newTemplate);
    setShowNewForm(false);
    setNewTemplate({
      name: '',
      description: '',
      content: defaultTemplateContent,
      styles: defaultTemplateStyles,
      isDefault: false
    });
  };

  const handleDuplicate = (template: InvoiceTemplate) => {
    onCreateTemplate({
      name: `${template.name} (Copy)`,
      description: template.description,
      content: template.content,
      styles: template.styles,
      isDefault: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Invoice Templates</h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <MdAdd className="w-5 h-5 mr-2" />
          New Template
        </button>
      </div>

      {/* New Template Form */}
      {showNewForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Create New Template</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HTML Content
              </label>
              <textarea
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                rows={10}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CSS Styles
              </label>
              <textarea
                value={newTemplate.styles}
                onChange={(e) => setNewTemplate({ ...newTemplate, styles: e.target.value })}
                rows={5}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                disabled={!newTemplate.name || !newTemplate.content}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {templates.map((template) => (
          <div key={template.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">
                  {template.name}
                  {template.isDefault && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Default
                    </span>
                  )}
                </h3>
                {template.description && (
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(template.id);
                    setEditForm(template);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Edit"
                >
                  <MdEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDuplicate(template)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Duplicate"
                >
                  <MdContentCopy className="w-5 h-5" />
                </button>
                {!template.isDefault && (
                  <>
                    <button
                      onClick={() => onSetDefaultTemplate(template.id)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                      title="Set as Default"
                    >
                      <MdCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(template.id)}
                      className="p-2 text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing === template.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HTML Content
                  </label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    rows={10}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CSS Styles
                  </label>
                  <textarea
                    value={editForm.styles}
                    onChange={(e) => setEditForm({ ...editForm, styles: e.target.value })}
                    rows={5}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsEditing(null);
                      setEditForm({});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(template.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{template.content.slice(0, 200)}...</code>
                  </pre>
                </div>
                {template.styles && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{template.styles.slice(0, 100)}...</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Template placeholder helpers
const tpl = (name: string) => `{{${name}}}`;

// Default template content
const defaultTemplateContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    {{styles}}
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <h1>INVOICE</h1>
      <div class="invoice-info">
        <p>Invoice #: {{invoiceNumber}}</p>
        <p>Date: {{date}}</p>
        <p>Due Date: {{dueDate}}</p>
      </div>
    </div>
    
    <div class="customer-info">
      <h2>Bill To:</h2>
      <p>{{customerName}}</p>
      <p>{{customerEmail}}</p>
    </div>
    
    <table class="items">
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {{items}}
      </tbody>
    </table>
    
    <div class="totals">
      <p>Subtotal: $${tpl('subtotal')}</p>
      <p>Tax: $${tpl('tax')}</p>
      <p class="total">Total: $${tpl('total')}</p>
    </div>
  </div>
</body>
</html>
`;

// Default template styles
const defaultTemplateStyles = `
.invoice {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.invoice-info {
  margin-top: 20px;
}

.customer-info {
  margin-bottom: 30px;
}

.items {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.items th,
.items td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.items th {
  background-color: #f8f9fa;
}

.totals {
  text-align: right;
}

.total {
  font-weight: bold;
  font-size: 1.2em;
}
`;

export default TemplateManager; 