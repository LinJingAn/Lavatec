export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

export interface Order {
  id: number;
  customerId: number;
  date: string; // ISO date string
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'delivered';
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  notes?: string;
}

export interface MonthlySpending {
  month: string; // Format: 'YYYY-MM'
  total: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface CategorySpending {
  category: string;
  totalSpent: number;
  percentage: number; // Percentage of total spending
  itemCount: number;
}

export interface CustomerSpendingAnalytics {
  totalSpending: number;
  orderCount: number;
  averageOrderValue: number;
  firstOrderDate: string;
  lastOrderDate: string;
  monthlySpending: MonthlySpending[];
  categorySpendings: CategorySpending[];
  frequentItems: Array<{
    name: string;
    count: number;
    totalSpent: number;
  }>;
  loyaltyScore: number; // 0-100 score based on frequency and spending
  spendingTrend: 'increasing' | 'decreasing' | 'stable';
}

// Generate mock orders for a customer
export const generateMockOrders = (customerId: number, count = 10): Order[] => {
  const now = new Date();
  const serviceCategories = ['lavagem', 'passadoria', 'lavagem_especial', 'tingimento', 'costura'];
  
  const serviceItems = [
    { category: 'lavagem', items: ['Lavagem Simples', 'Lavagem Completa', 'Lavagem de Edredom', 'Lavagem de Tapete'] },
    { category: 'passadoria', items: ['Passar Camisa', 'Passar Calça', 'Passar Vestido', 'Passar Conjunto'] },
    { category: 'lavagem_especial', items: ['Lavagem de Terno', 'Lavagem de Vestido de Festa', 'Limpeza a Seco'] },
    { category: 'tingimento', items: ['Tingimento Simples', 'Tingimento Especial'] },
    { category: 'costura', items: ['Ajuste de Barra', 'Conserto de Zíper', 'Ajuste de Cintura'] }
  ];
  
  const priceRanges = {
    'lavagem': { min: 30, max: 60 },
    'passadoria': { min: 10, max: 25 },
    'lavagem_especial': { min: 70, max: 200 },
    'tingimento': { min: 50, max: 120 },
    'costura': { min: 20, max: 50 }
  };
  
  const paymentMethods = ['Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'PIX', 'Transferência Bancária'];
  const statuses: Array<Order['status']> = ['pending', 'processing', 'completed', 'cancelled', 'delivered'];
  
  const orders: Order[] = [];
  
  // Generate orders from newest to oldest
  for (let i = 0; i < count; i++) {
    const orderDate = new Date();
    // Make older orders more likely to be completed
    const daysAgo = i * 7 + Math.floor(Math.random() * 14); // Progressively older orders
    orderDate.setDate(now.getDate() - daysAgo);
    
    const statusProbability = Math.min(0.9, daysAgo / 30); // More likely completed if older
    const status = Math.random() < 0.1 
      ? 'cancelled' 
      : Math.random() < statusProbability 
        ? 'completed' 
        : Math.random() < 0.5 
          ? 'delivered' 
          : Math.random() < 0.7 
            ? 'processing' 
            : 'pending';
    
    // Generate 1-4 items per order
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items: OrderItem[] = [];
    let total = 0;
    
    for (let j = 0; j < itemCount; j++) {
      // Select a random category and item
      const categoryIndex = Math.floor(Math.random() * serviceCategories.length);
      const category = serviceCategories[categoryIndex];
      const categoryItems = serviceItems.find(c => c.category === category)?.items || [];
      const itemName = categoryItems[Math.floor(Math.random() * categoryItems.length)];
      
      // Generate quantity and price
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = Math.floor(Math.random() * (priceRanges[category as keyof typeof priceRanges].max - 
                                               priceRanges[category as keyof typeof priceRanges].min)) + 
                                               priceRanges[category as keyof typeof priceRanges].min;
      
      const item: OrderItem = {
        id: j + 1,
        name: itemName,
        quantity,
        price,
        category
      };
      
      items.push(item);
      total += item.price * item.quantity;
    }
    
    orders.push({
      id: 1000 + i,
      customerId,
      date: orderDate.toISOString(),
      status,
      items,
      total,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      notes: Math.random() > 0.7 ? 'Observações sobre o pedido.' : undefined
    });
  }
  
  // Sort by date (newest first)
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate spending analytics from orders
export const generateSpendingAnalytics = (orders: Order[]): CustomerSpendingAnalytics => {
  if (!orders.length) {
    return {
      totalSpending: 0,
      orderCount: 0,
      averageOrderValue: 0,
      firstOrderDate: '',
      lastOrderDate: '',
      monthlySpending: [],
      categorySpendings: [],
      frequentItems: [],
      loyaltyScore: 0,
      spendingTrend: 'stable'
    };
  }
  
  // Calculate basic metrics
  const totalSpending = orders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = orders.length;
  const averageOrderValue = totalSpending / orderCount;
  
  // Find first and last order dates
  const sortedByDate = [...orders].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const firstOrderDate = sortedByDate[0].date;
  const lastOrderDate = sortedByDate[sortedByDate.length - 1].date;
  
  // Calculate monthly spending
  const monthlyData: Record<string, { total: number, count: number }> = {};
  orders.forEach(order => {
    const date = new Date(order.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { total: 0, count: 0 };
    }
    
    monthlyData[monthKey].total += order.total;
    monthlyData[monthKey].count += 1;
  });
  
  const monthlySpending: MonthlySpending[] = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      total: data.total,
      orderCount: data.count,
      averageOrderValue: data.total / data.count
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  // Calculate category spending
  const categoryData: Record<string, { total: number, count: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = { total: 0, count: 0 };
      }
      
      categoryData[item.category].total += item.price * item.quantity;
      categoryData[item.category].count += item.quantity;
    });
  });
  
  const categorySpendings: CategorySpending[] = Object.entries(categoryData)
    .map(([category, data]) => ({
      category,
      totalSpent: data.total,
      percentage: (data.total / totalSpending) * 100,
      itemCount: data.count
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
  
  // Calculate frequent items
  const itemData: Record<string, { total: number, count: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemData[item.name]) {
        itemData[item.name] = { total: 0, count: 0 };
      }
      
      itemData[item.name].total += item.price * item.quantity;
      itemData[item.name].count += item.quantity;
    });
  });
  
  const frequentItems = Object.entries(itemData)
    .map(([name, data]) => ({
      name,
      count: data.count,
      totalSpent: data.total
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Calculate loyalty score (simple mock algorithm)
  let loyaltyScore = Math.min(100, (orderCount * 5) + (totalSpending / 100));
  
  // Determine spending trend
  let spendingTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (monthlySpending.length >= 3) {
    const recentMonths = monthlySpending.slice(-3);
    if (recentMonths[2].total > recentMonths[0].total * 1.1) {
      spendingTrend = 'increasing';
    } else if (recentMonths[2].total < recentMonths[0].total * 0.9) {
      spendingTrend = 'decreasing';
    }
  }
  
  return {
    totalSpending,
    orderCount,
    averageOrderValue,
    firstOrderDate,
    lastOrderDate,
    monthlySpending,
    categorySpendings,
    frequentItems,
    loyaltyScore,
    spendingTrend
  };
}; 