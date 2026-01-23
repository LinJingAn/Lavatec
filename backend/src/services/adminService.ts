import pool from '../config/database.js';

// Admin Types
export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isSystem: boolean;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  module: string;
}

export interface SystemConfig {
  key: string;
  value: any;
  type: string;
  category: string;
  description?: string;
}

class AdminService {
  // ==========================================
  // ROLES & PERMISSIONS
  // ==========================================

  /**
   * Get all roles with their permissions
   */
  async getRoles(): Promise<Role[]> {
    const rolesResult = await pool.query(
      `SELECT r.*, 
              COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as permissions
       FROM roles r
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rp.permission_id
       GROUP BY r.id
       ORDER BY r.name`
    );
    
    return rolesResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      displayName: row.display_name,
      description: row.description,
      isSystem: row.is_system,
      permissions: row.permissions,
    }));
  }

  /**
   * Get role by ID
   */
  async getRole(roleId: string): Promise<Role | null> {
    const result = await pool.query(
      `SELECT r.*, 
              COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as permissions
       FROM roles r
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rp.permission_id
       WHERE r.id = $1
       GROUP BY r.id`,
      [roleId]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      displayName: row.display_name,
      description: row.description,
      isSystem: row.is_system,
      permissions: row.permissions,
    };
  }

  /**
   * Create a new role
   */
  async createRole(data: {
    name: string;
    displayName: string;
    description?: string;
    permissionIds?: string[];
  }): Promise<Role> {
    const result = await pool.query(
      `INSERT INTO roles (name, display_name, description)
       VALUES ($1, $2, $3) RETURNING *`,
      [data.name, data.displayName, data.description]
    );

    const roleId = result.rows[0].id;

    // Add permissions
    if (data.permissionIds && data.permissionIds.length > 0) {
      for (const permId of data.permissionIds) {
        await pool.query(
          `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [roleId, permId]
        );
      }
    }

    return this.getRole(roleId) as Promise<Role>;
  }

  /**
   * Update a role
   */
  async updateRole(roleId: string, data: {
    displayName?: string;
    description?: string;
    permissionIds?: string[];
  }): Promise<Role | null> {
    // Check if system role
    const roleCheck = await pool.query(`SELECT is_system FROM roles WHERE id = $1`, [roleId]);
    if (roleCheck.rows.length === 0) return null;
    if (roleCheck.rows[0].is_system) {
      throw new Error('Cannot modify system roles');
    }

    // Update role details
    if (data.displayName || data.description !== undefined) {
      await pool.query(
        `UPDATE roles SET 
          display_name = COALESCE($2, display_name),
          description = COALESCE($3, description)
         WHERE id = $1`,
        [roleId, data.displayName, data.description]
      );
    }

    // Update permissions
    if (data.permissionIds) {
      await pool.query(`DELETE FROM role_permissions WHERE role_id = $1`, [roleId]);
      for (const permId of data.permissionIds) {
        await pool.query(
          `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)`,
          [roleId, permId]
        );
      }
    }

    return this.getRole(roleId);
  }

  /**
   * Delete a role
   */
  async deleteRole(roleId: string): Promise<boolean> {
    const roleCheck = await pool.query(`SELECT is_system FROM roles WHERE id = $1`, [roleId]);
    if (roleCheck.rows.length === 0) return false;
    if (roleCheck.rows[0].is_system) {
      throw new Error('Cannot delete system roles');
    }

    await pool.query(`DELETE FROM role_permissions WHERE role_id = $1`, [roleId]);
    await pool.query(`DELETE FROM user_roles WHERE role_id = $1`, [roleId]);
    await pool.query(`DELETE FROM roles WHERE id = $1`, [roleId]);

    return true;
  }

  /**
   * Get all permissions
   */
  async getPermissions(): Promise<Permission[]> {
    const result = await pool.query(`SELECT * FROM permissions ORDER BY module, name`);
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      displayName: row.display_name,
      description: row.description,
      module: row.module,
    }));
  }

  /**
   * Get permissions grouped by module
   */
  async getPermissionsByModule(): Promise<Record<string, Permission[]>> {
    const permissions = await this.getPermissions();
    return permissions.reduce((acc, perm) => {
      if (!acc[perm.module]) acc[perm.module] = [];
      acc[perm.module].push(perm);
      return acc;
    }, {} as Record<string, Permission[]>);
  }

  // ==========================================
  // USER ROLES
  // ==========================================

  /**
   * Assign role to user
   */
  async assignUserRole(userId: string, roleId: string, branchId?: string): Promise<void> {
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, branch_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, role_id) DO UPDATE SET branch_id = EXCLUDED.branch_id`,
      [userId, roleId, branchId]
    );
  }

  /**
   * Remove role from user
   */
  async removeUserRole(userId: string, roleId: string): Promise<void> {
    await pool.query(
      `DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2`,
      [userId, roleId]
    );
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const result = await pool.query(
      `SELECT r.*, ur.branch_id
       FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = $1`,
      [userId]
    );

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      displayName: row.display_name,
      description: row.description,
      isSystem: row.is_system,
      branchId: row.branch_id,
    })) as Role[];
  }

  /**
   * Check if user has permission
   */
  async hasPermission(userId: string, permissionName: string, branchId?: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1 FROM user_roles ur
       JOIN role_permissions rp ON rp.role_id = ur.role_id
       JOIN permissions p ON p.id = rp.permission_id
       WHERE ur.user_id = $1 AND p.name = $2
         AND (ur.branch_id IS NULL OR ur.branch_id = $3)
       LIMIT 1`,
      [userId, permissionName, branchId]
    );

    return result.rows.length > 0;
  }

  /**
   * Get all user permissions
   */
  async getUserPermissions(userId: string, branchId?: string): Promise<string[]> {
    const result = await pool.query(
      `SELECT DISTINCT p.name
       FROM user_roles ur
       JOIN role_permissions rp ON rp.role_id = ur.role_id
       JOIN permissions p ON p.id = rp.permission_id
       WHERE ur.user_id = $1
         AND (ur.branch_id IS NULL OR ur.branch_id = $2)`,
      [userId, branchId]
    );

    return result.rows.map(row => row.name);
  }

  // ==========================================
  // SYSTEM CONFIGURATION
  // ==========================================

  /**
   * Get system configuration value
   */
  async getConfig(key: string): Promise<any> {
    const result = await pool.query(
      `SELECT value, type FROM system_config WHERE key = $1`,
      [key]
    );

    if (result.rows.length === 0) return null;

    const { value, type } = result.rows[0];
    return this.parseConfigValue(value, type);
  }

  /**
   * Get all configuration by category
   */
  async getConfigByCategory(category: string): Promise<SystemConfig[]> {
    const result = await pool.query(
      `SELECT * FROM system_config WHERE category = $1 ORDER BY key`,
      [category]
    );

    return result.rows.map(row => ({
      key: row.key,
      value: this.parseConfigValue(row.value, row.type),
      type: row.type,
      category: row.category,
      description: row.description,
    }));
  }

  /**
   * Get all configuration
   */
  async getAllConfig(): Promise<Record<string, SystemConfig[]>> {
    const result = await pool.query(
      `SELECT * FROM system_config ORDER BY category, key`
    );

    return result.rows.reduce((acc, row) => {
      if (!acc[row.category]) acc[row.category] = [];
      acc[row.category].push({
        key: row.key,
        value: this.parseConfigValue(row.value, row.type),
        type: row.type,
        category: row.category,
        description: row.description,
      });
      return acc;
    }, {} as Record<string, SystemConfig[]>);
  }

  /**
   * Set system configuration value
   */
  async setConfig(key: string, value: any, options?: {
    type?: string;
    category?: string;
    description?: string;
    userId?: string;
  }): Promise<void> {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const type = options?.type || (typeof value === 'object' ? 'json' : typeof value);

    await pool.query(
      `INSERT INTO system_config (key, value, type, category, description, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (key) DO UPDATE SET
         value = EXCLUDED.value,
         type = COALESCE(EXCLUDED.type, system_config.type),
         category = COALESCE(EXCLUDED.category, system_config.category),
         description = COALESCE(EXCLUDED.description, system_config.description),
         updated_by = EXCLUDED.updated_by,
         updated_at = CURRENT_TIMESTAMP`,
      [key, stringValue, type, options?.category || 'general', options?.description, options?.userId]
    );
  }

  /**
   * Delete configuration
   */
  async deleteConfig(key: string): Promise<void> {
    await pool.query(`DELETE FROM system_config WHERE key = $1`, [key]);
  }

  private parseConfigValue(value: string, type: string): any {
    switch (type) {
      case 'number': return parseFloat(value);
      case 'boolean': return value === 'true';
      case 'json': return JSON.parse(value);
      default: return value;
    }
  }

  // ==========================================
  // MULTI-BRANCH MANAGEMENT
  // ==========================================

  /**
   * Get branches with hierarchy
   */
  async getBranchesHierarchy(): Promise<any[]> {
    const result = await pool.query(
      `WITH RECURSIVE branch_tree AS (
         SELECT b.*, 0 as level, ARRAY[b.id] as path
         FROM branches b
         WHERE b.parent_id IS NULL
         UNION ALL
         SELECT b.*, bt.level + 1, bt.path || b.id
         FROM branches b
         JOIN branch_tree bt ON b.parent_id = bt.id
       )
       SELECT bt.*, u.name as manager_name
       FROM branch_tree bt
       LEFT JOIN users u ON u.id = bt.manager_id
       ORDER BY path`
    );

    return result.rows;
  }

  /**
   * Get branches for user
   */
  async getUserBranches(userId: string): Promise<any[]> {
    // Check if user is admin (has access to all branches)
    const isAdmin = await this.hasPermission(userId, 'admin.branches');
    
    if (isAdmin) {
      const result = await pool.query(`SELECT * FROM branches WHERE is_active = true ORDER BY name`);
      return result.rows;
    }

    // Get branches where user has role
    const result = await pool.query(
      `SELECT DISTINCT b.*
       FROM branches b
       JOIN user_roles ur ON ur.branch_id = b.id OR ur.branch_id IS NULL
       WHERE ur.user_id = $1 AND b.is_active = true
       ORDER BY b.name`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Create branch
   */
  async createBranch(data: {
    name: string;
    type?: string;
    parentId?: string;
    managerId?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    email?: string;
    settings?: Record<string, any>;
  }): Promise<any> {
    const result = await pool.query(
      `INSERT INTO branches (
        name, type, parent_id, manager_id, address, city, state, zip_code, phone, email, settings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        data.name, data.type || 'store', data.parentId, data.managerId,
        data.address, data.city, data.state, data.zipCode, data.phone, data.email,
        JSON.stringify(data.settings || {}),
      ]
    );

    return result.rows[0];
  }

  /**
   * Update branch
   */
  async updateBranch(branchId: string, data: {
    name?: string;
    type?: string;
    parentId?: string;
    managerId?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    email?: string;
    settings?: Record<string, any>;
    isActive?: boolean;
  }): Promise<any> {
    const result = await pool.query(
      `UPDATE branches SET
        name = COALESCE($2, name),
        type = COALESCE($3, type),
        parent_id = COALESCE($4, parent_id),
        manager_id = COALESCE($5, manager_id),
        address = COALESCE($6, address),
        city = COALESCE($7, city),
        state = COALESCE($8, state),
        zip_code = COALESCE($9, zip_code),
        phone = COALESCE($10, phone),
        email = COALESCE($11, email),
        settings = COALESCE($12, settings),
        is_active = COALESCE($13, is_active),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [
        branchId, data.name, data.type, data.parentId, data.managerId,
        data.address, data.city, data.state, data.zipCode, data.phone, data.email,
        data.settings ? JSON.stringify(data.settings) : null, data.isActive,
      ]
    );

    return result.rows[0];
  }

  /**
   * Get branch settings
   */
  async getBranchSettings(branchId: string): Promise<Record<string, any>> {
    const result = await pool.query(
      `SELECT settings FROM branches WHERE id = $1`,
      [branchId]
    );

    return result.rows[0]?.settings || {};
  }

  /**
   * Update branch settings
   */
  async updateBranchSettings(branchId: string, settings: Record<string, any>): Promise<void> {
    await pool.query(
      `UPDATE branches SET 
        settings = settings || $2::jsonb,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [branchId, JSON.stringify(settings)]
    );
  }

  // ==========================================
  // AUDIT LOG
  // ==========================================

  /**
   * Log an action
   */
  async logAction(params: {
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await pool.query(
      `INSERT INTO audit_logs (
        user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        params.userId, params.action, params.entityType, params.entityId,
        params.oldValues ? JSON.stringify(params.oldValues) : null,
        params.newValues ? JSON.stringify(params.newValues) : null,
        params.ipAddress, params.userAgent,
      ]
    );
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(params: {
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: any[]; total: number }> {
    let query = `SELECT al.*, u.name as user_name, u.email as user_email
                 FROM audit_logs al
                 LEFT JOIN users u ON u.id = al.user_id
                 WHERE 1=1`;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.userId) {
      query += ` AND al.user_id = $${paramIndex++}`;
      queryParams.push(params.userId);
    }

    if (params.entityType) {
      query += ` AND al.entity_type = $${paramIndex++}`;
      queryParams.push(params.entityType);
    }

    if (params.entityId) {
      query += ` AND al.entity_id = $${paramIndex++}`;
      queryParams.push(params.entityId);
    }

    if (params.action) {
      query += ` AND al.action = $${paramIndex++}`;
      queryParams.push(params.action);
    }

    if (params.startDate) {
      query += ` AND al.created_at >= $${paramIndex++}`;
      queryParams.push(params.startDate);
    }

    if (params.endDate) {
      query += ` AND al.created_at <= $${paramIndex++}`;
      queryParams.push(params.endDate);
    }

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as subquery`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ` ORDER BY al.created_at DESC`;
    if (params.limit) {
      query += ` LIMIT $${paramIndex++}`;
      queryParams.push(params.limit);
    }
    if (params.offset) {
      query += ` OFFSET $${paramIndex++}`;
      queryParams.push(params.offset);
    }

    const result = await pool.query(query, queryParams);

    return { logs: result.rows, total };
  }
}

export const adminService = new AdminService();
export default adminService;
