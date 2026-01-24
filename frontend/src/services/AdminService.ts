import { api } from '../utils/api';

export interface Branch {
  id: string;
  name: string;
  code?: string;
  type: 'headquarters' | 'branch' | 'franchise';
  parent_id?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  manager_name?: string;
  is_active?: boolean;
  settings?: BranchSettings;
  created_at: string;
  updated_at?: string;
}

export interface BranchSettings {
  opening_hours?: { [key: string]: { open: string; close: string } };
  delivery_enabled?: boolean;
  pickup_enabled?: boolean;
  max_daily_orders?: number;
  tax_rate?: number;
  currency?: string;
  timezone?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  is_system?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
  action: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  roles?: { role_id: string; branch_id?: string }[];
  branch_id?: string;
  is_active?: boolean;
  last_login?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface SystemConfig {
  key: string;
  value: any;
  type?: 'string' | 'number' | 'boolean' | 'json';
  category?: string;
  description?: string;
  updated_at?: string;
}

class AdminServiceClass {
  private static instance: AdminServiceClass;

  private constructor() {}

  static getInstance(): AdminServiceClass {
    if (!AdminServiceClass.instance) {
      AdminServiceClass.instance = new AdminServiceClass();
    }
    return AdminServiceClass.instance;
  }

  // Branches
  async getBranches(hierarchy?: boolean): Promise<{ branches: Branch[] }> {
    try {
      const url = hierarchy ? '/admin/branches?hierarchy=true' : '/admin/branches';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  }

  async createBranch(branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>): Promise<{ branch: Branch }> {
    try {
      const response = await api.post('/admin/branches', branch);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  async updateBranch(id: string, updates: Partial<Branch>): Promise<{ branch: Branch }> {
    try {
      const response = await api.put(`/admin/branches/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  async getBranchSettings(id: string): Promise<{ settings: BranchSettings }> {
    try {
      const response = await api.get(`/admin/branches/${id}/settings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch settings:', error);
      throw error;
    }
  }

  async updateBranchSettings(id: string, settings: Partial<BranchSettings>): Promise<void> {
    try {
      await api.put(`/admin/branches/${id}/settings`, settings);
    } catch (error) {
      console.error('Error updating branch settings:', error);
      throw error;
    }
  }

  // Roles
  async getRoles(): Promise<{ roles: Role[] }> {
    try {
      const response = await api.get('/admin/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  async createRole(role: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<{ role: Role }> {
    try {
      const response = await api.post('/admin/roles', role);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async updateRole(id: string, updates: Partial<Role>): Promise<{ role: Role }> {
    try {
      const response = await api.put(`/admin/roles/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async deleteRole(id: string): Promise<void> {
    try {
      await api.delete(`/admin/roles/${id}`);
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  // Permissions
  async getPermissions(grouped?: boolean): Promise<{ permissions: Permission[] | { [module: string]: Permission[] } }> {
    try {
      const url = grouped ? '/admin/permissions?grouped=true' : '/admin/permissions';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  // User Roles
  async assignUserRole(userId: string, roleId: string, branchId?: string): Promise<void> {
    try {
      await api.post(`/admin/users/${userId}/roles`, { roleId, branchId });
    } catch (error) {
      console.error('Error assigning user role:', error);
      throw error;
    }
  }

  async removeUserRole(userId: string, roleId: string): Promise<void> {
    try {
      await api.delete(`/admin/users/${userId}/roles/${roleId}`);
    } catch (error) {
      console.error('Error removing user role:', error);
      throw error;
    }
  }

  async getUserPermissions(userId: string, branchId?: string): Promise<{ permissions: string[] }> {
    try {
      const params = branchId ? `?branchId=${branchId}` : '';
      const response = await api.get(`/admin/users/${userId}/permissions${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  }

  // System Config
  async getConfig(category?: string): Promise<{ config: SystemConfig[] | { [key: string]: any } }> {
    try {
      const url = category ? `/admin/config?category=${category}` : '/admin/config';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching config:', error);
      throw error;
    }
  }

  async setConfig(key: string, value: any, options?: { type?: string; category?: string; description?: string }): Promise<void> {
    try {
      await api.post('/admin/config', { key, value, ...options });
    } catch (error) {
      console.error('Error setting config:', error);
      throw error;
    }
  }

  // Audit Logs
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<{ logs: AuditLog[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.entityId) params.append('entityId', filters.entityId);
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.offset) params.append('offset', String(filters.offset));

      const queryString = params.toString();
      const url = queryString ? `/admin/audit-logs?${queryString}` : '/admin/audit-logs';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }
}

export const AdminService = AdminServiceClass.getInstance();
export default AdminService;
