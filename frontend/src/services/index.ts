// Export all services
export { OrderService } from './OrderService';
export type { 
  Order, 
  OrderItem, 
  OrderStatus, 
  OrderTimelineEvent,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderFilters 
} from './OrderService';

export { CustomerService } from './CustomerService';
export type { 
  Customer,
  CustomerAddress,
  CustomerWashingPreferences,
  CustomerNote,
  CustomerCommunicationLog,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerFilters,
  CustomerPagination
} from './CustomerService';

export { DashboardService } from './DashboardService';
export type {
  OverviewDashboard,
  FinancialDashboard,
  OperationalDashboard,
  CustomerAnalytics,
  KPIs
} from './DashboardService';

export { AdminService } from './AdminService';
export type {
  Branch,
  BranchSettings,
  Role,
  Permission,
  User,
  AuditLog,
  AuditLogFilters,
  SystemConfig
} from './AdminService';

export { FinancialService } from './FinancialService';
export type {
  AccountPayable,
  AccountReceivable,
  CashFlowTransaction,
  CashFlowReport,
  BankAccount,
  FinancialCategory,
  AccountFilters
} from './FinancialService';

export { DeliveryService } from './DeliveryService';
export { PromotionService } from './PromotionService';
export { InvoiceService } from './InvoiceService';
export { SupplyService } from './SupplyService';
export { pricingService } from './PricingService';

// User/Employee Management
export { UserService } from './UserService';
export type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeFilters,
  Schedule,
  Training,
  Benefit,
  PayrollEntry
} from './UserService';

// Marketing
export { MarketingService } from './MarketingService';
export type {
  Campaign,
  EmailTemplate,
  SMSTemplate,
  CustomerSegment,
  LoyaltyProgram,
  LoyaltyTier,
  CommunicationLog
} from './MarketingService';

// Reports
export { ReportsService } from './ReportsService';
export type {
  ReportFilter,
  SalesReport,
  ServiceReport,
  CustomerReport,
  EmployeePerformanceReport,
  OperationalReport,
  InventoryReport,
  FinancialSummary
} from './ReportsService';

// Inventory
export { InventoryService } from './InventoryService';
export type {
  InventoryItem,
  InventoryCategory,
  Supplier,
  StockMovement,
  PurchaseOrder,
  PurchaseOrderItem
} from './InventoryService';

// Services
export { ServiceService } from './ServiceService';
export type {
  ServiceType,
  ServiceCategory as ServiceCategoryType,
  GarmentType,
  PriceRule,
  ServiceFilters
} from './ServiceService';
