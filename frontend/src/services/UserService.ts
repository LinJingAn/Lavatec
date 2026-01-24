import { api } from '../utils/api';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  branch_id?: string;
  branch_name?: string;
  position?: string;
  hire_date?: string;
  salary?: number;
  status: 'active' | 'inactive' | 'on_leave';
  avatar_url?: string;
  permissions?: string[];
  created_at: string;
  updated_at?: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  department?: string;
  branch_id?: string;
  position?: string;
  hire_date?: string;
  salary?: number;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  branch_id?: string;
  position?: string;
  salary?: number;
  status?: 'active' | 'inactive' | 'on_leave';
  avatar_url?: string;
}

export interface EmployeeFilters {
  search?: string;
  role?: string;
  department?: string;
  branch_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface Schedule {
  id: string;
  employee_id: string;
  employee_name?: string;
  day_of_week: number; // 0-6, Sunday-Saturday
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
  is_day_off?: boolean;
}

export interface Training {
  id: string;
  employee_id: string;
  title: string;
  description?: string;
  type: 'mandatory' | 'optional' | 'certification';
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  start_date: string;
  end_date?: string;
  certificate_url?: string;
  score?: number;
}

export interface Benefit {
  id: string;
  employee_id: string;
  type: 'health' | 'dental' | 'transport' | 'food' | 'other';
  name: string;
  value: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive';
}

export interface PayrollEntry {
  id: string;
  employee_id: string;
  employee_name?: string;
  period: string; // YYYY-MM
  base_salary: number;
  overtime_hours?: number;
  overtime_value?: number;
  deductions?: number;
  bonuses?: number;
  net_salary: number;
  status: 'pending' | 'processed' | 'paid';
  payment_date?: string;
}

class UserServiceClass {
  private static instance: UserServiceClass;

  private constructor() {}

  static getInstance(): UserServiceClass {
    if (!UserServiceClass.instance) {
      UserServiceClass.instance = new UserServiceClass();
    }
    return UserServiceClass.instance;
  }

  // Employees
  async getEmployees(filters: EmployeeFilters = {}): Promise<{ employees: Employee[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.department) params.append('department', filters.department);
      if (filters.branch_id) params.append('branch_id', filters.branch_id);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));

      const queryString = params.toString();
      const url = queryString ? `/admin/users?${queryString}` : '/admin/users';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  async createEmployee(employee: CreateEmployeeRequest): Promise<{ employee: Employee }> {
    try {
      const response = await api.post('/auth/register', {
        ...employee,
        role: employee.role || 'employee'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(id: string, updates: UpdateEmployeeRequest): Promise<{ employee: Employee }> {
    try {
      const response = await api.put(`/admin/users/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await api.delete(`/admin/users/${id}`);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  // Schedules
  async getSchedules(employeeId?: string): Promise<{ schedules: Schedule[] }> {
    try {
      const url = employeeId ? `/admin/schedules?employee_id=${employeeId}` : '/admin/schedules';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  }

  async updateSchedule(id: string, schedule: Partial<Schedule>): Promise<{ schedule: Schedule }> {
    try {
      const response = await api.put(`/admin/schedules/${id}`, schedule);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  }

  // Training
  async getTrainings(employeeId?: string): Promise<{ trainings: Training[] }> {
    try {
      const url = employeeId ? `/admin/trainings?employee_id=${employeeId}` : '/admin/trainings';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }
  }

  async createTraining(training: Omit<Training, 'id'>): Promise<{ training: Training }> {
    try {
      const response = await api.post('/admin/trainings', training);
      return response.data;
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  }

  async updateTrainingStatus(id: string, status: Training['status']): Promise<{ training: Training }> {
    try {
      const response = await api.put(`/admin/trainings/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating training:', error);
      throw error;
    }
  }

  // Benefits
  async getBenefits(employeeId?: string): Promise<{ benefits: Benefit[] }> {
    try {
      const url = employeeId ? `/admin/benefits?employee_id=${employeeId}` : '/admin/benefits';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits:', error);
      throw error;
    }
  }

  async createBenefit(benefit: Omit<Benefit, 'id'>): Promise<{ benefit: Benefit }> {
    try {
      const response = await api.post('/admin/benefits', benefit);
      return response.data;
    } catch (error) {
      console.error('Error creating benefit:', error);
      throw error;
    }
  }

  // Payroll
  async getPayroll(filters: { employee_id?: string; period?: string; status?: string } = {}): Promise<{ entries: PayrollEntry[] }> {
    try {
      const params = new URLSearchParams();
      if (filters.employee_id) params.append('employee_id', filters.employee_id);
      if (filters.period) params.append('period', filters.period);
      if (filters.status) params.append('status', filters.status);

      const queryString = params.toString();
      const url = queryString ? `/admin/payroll?${queryString}` : '/admin/payroll';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching payroll:', error);
      throw error;
    }
  }

  async processPayroll(period: string, employeeIds?: string[]): Promise<{ entries: PayrollEntry[] }> {
    try {
      const response = await api.post('/admin/payroll/process', { period, employeeIds });
      return response.data;
    } catch (error) {
      console.error('Error processing payroll:', error);
      throw error;
    }
  }
}

export const UserService = UserServiceClass.getInstance();
export default UserService;
