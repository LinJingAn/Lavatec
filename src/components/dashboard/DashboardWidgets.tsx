import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table';
  title: string;
  data: any;
}

interface DashboardWidgetsProps {
  widgets: Widget[];
  onWidgetsChange: (widgets: Widget[]) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ 
  widgets, 
  onWidgetsChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onWidgetsChange(items);
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'chart':
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={widget.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'metric':
        return (
          <div className="space-y-2">
            {Object.entries(widget.data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}</span>
                <span>{formatCurrency(value as number)}</span>
              </div>
            ))}
          </div>
        );
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {Object.keys(widget.data[0]).map((key) => {
                    const translatedKey = 
                      key === 'service' ? 'serviço' :
                      key === 'revenue' ? 'receita' :
                      key === 'orders' ? 'pedidos' :
                      key === 'avgRating' ? 'avaliação' :
                      key === 'name' ? 'nome' :
                      key === 'tasks' ? 'tarefas' :
                      key === 'efficiency' ? 'eficiência' :
                      key === 'rating' ? 'nota' :
                      key;
                    
                    return (
                      <th key={key} className="text-left p-2">{translatedKey}</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {widget.data.map((row: any, index: number) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, i: number) => (
                      <td key={i} className="p-2">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Concluído' : 'Editar Layout'}
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {widgets.map((widget, index) => (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id}
                  index={index}
                  isDragDisabled={!isEditing}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>{widget.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderWidget(widget)}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}; 