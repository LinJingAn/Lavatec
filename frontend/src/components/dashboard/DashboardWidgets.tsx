import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export interface Widget {
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
    // Safety check: ensure widget.data exists
    if (!widget.data) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8 animate-pulse">
          Sem dados disponíveis
        </div>
      );
    }

    switch (widget.type) {
      case 'chart':
        // Ensure data is an array
        const chartData = Array.isArray(widget.data) ? widget.data : [];
        if (chartData.length === 0) {
          return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 animate-pulse">
              Sem dados para exibir
            </div>
          );
        }
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="#22c55e" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationBegin={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'metric':
        // Ensure data is an object
        const metricData = typeof widget.data === 'object' && widget.data !== null && !Array.isArray(widget.data) 
          ? widget.data 
          : {};
        const entries = Object.entries(metricData);
        if (entries.length === 0) {
          return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 animate-pulse">
              Sem métricas disponíveis
            </div>
          );
        }
        return (
          <div className="space-y-2">
            {entries.map(([key, value], index) => (
              <div 
                key={key} 
                className="flex justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                style={{ 
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <span className="capitalize text-gray-700 dark:text-gray-300">{key}</span>
                <span className="font-semibold text-gray-900 dark:text-white transition-all duration-300 hover:scale-105">
                  {typeof value === 'number' ? formatCurrency(value as number) : value as string}
                </span>
              </div>
            ))}
          </div>
        );
      case 'table':
        // Ensure data is an array with at least one element
        const tableData = Array.isArray(widget.data) ? widget.data : [];
        if (tableData.length === 0 || !tableData[0] || typeof tableData[0] !== 'object') {
          return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 animate-pulse">
              Sem dados na tabela
            </div>
          );
        }
        const firstRow = tableData[0];
        const columns = Object.keys(firstRow);
        if (columns.length === 0) {
          return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 animate-pulse">
              Sem colunas para exibir
            </div>
          );
        }
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {columns.map((key) => {
                    const translatedKey = 
                      key === 'service' ? 'serviço' :
                      key === 'revenue' ? 'receita' :
                      key === 'orders' ? 'pedidos' :
                      key === 'avgRating' ? 'avaliação' :
                      key === 'name' ? 'nome' :
                      key === 'tasks' ? 'tarefas' :
                      key === 'efficiency' ? 'eficiência' :
                      key === 'rating' ? 'nota' :
                      key === 'customer' ? 'cliente' :
                      key === 'amount' ? 'valor' :
                      key === 'status' ? 'status' :
                      key === 'id' ? 'ID' :
                      key;
                    
                    return (
                      <th key={key} className="text-left p-2 text-gray-700 dark:text-gray-300 font-medium">
                        {translatedKey}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row: any, index: number) => (
                  <tr 
                    key={index} 
                    className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
                    style={{ 
                      animation: `fadeInLeft 0.5s ease-out ${index * 0.05}s both`
                    }}
                  >
                    {columns.map((colKey, i: number) => (
                      <td key={i} className="p-2 text-gray-600 dark:text-gray-400">
                        {row[colKey] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 animate-pulse">
            Tipo de widget desconhecido
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-slate-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isEditing ? 'Concluído' : 'Editar Layout'}
        </Button>
      </div>

      {widgets.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 animate-pulse">
          Nenhum widget disponível
        </div>
      ) : (
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
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-all duration-300 ${
                          snapshot.isDragging 
                            ? 'opacity-50 rotate-2 scale-105 shadow-2xl' 
                            : 'opacity-100'
                        }`}
                        style={{ 
                          ...provided.draggableProps.style,
                          animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                          <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-white">{widget.title}</CardTitle>
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
      )}
    </div>
  );
}; 