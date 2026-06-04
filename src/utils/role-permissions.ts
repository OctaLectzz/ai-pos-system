export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'OPERATOR'

export type PermissionAction =
  | 'dashboard:full'
  | 'dashboard:limited'
  | 'category:read'
  | 'category:write'
  | 'product:read'
  | 'product:write'
  | 'order:read'
  | 'order:write'
  | 'pos:access'
  | 'reports:full'
  | 'ai:access'
  | 'whatsapp:config'
  | 'settings:store'
  | 'settings:team'
  | 'user:manage'
  | 'system:settings'

const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  SUPERADMIN: [
    'dashboard:full',
    'dashboard:limited',
    'category:read',
    'category:write',
    'product:read',
    'product:write',
    'order:read',
    'order:write',
    'pos:access',
    'reports:full',
    'ai:access',
    'whatsapp:config',
    'settings:store',
    'settings:team',
    'user:manage',
    'system:settings'
  ],
  ADMIN: [
    'dashboard:full',
    'dashboard:limited',
    'category:read',
    'category:write',
    'product:read',
    'product:write',
    'order:read',
    'order:write',
    'pos:access',
    'reports:full',
    'ai:access',
    'whatsapp:config',
    'settings:store',
    'settings:team'
  ],
  OPERATOR: ['dashboard:limited', 'category:read', 'product:read', 'order:read', 'order:write', 'pos:access']
}

/**
 * Checks if a role has permission to perform a specific action.
 * @param role - The user role to verify.
 * @param action - The action permission string.
 * @returns boolean indicating if the role has permission.
 */
export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  if (!permissions) {
    return false
  }
  return permissions.includes(action)
}
