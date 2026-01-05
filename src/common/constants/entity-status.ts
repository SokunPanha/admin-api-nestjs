// Entity Status Enums
// These enums are used for type safety in code
// Values are stored as VARCHAR strings in the database

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum RoleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum MenuStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

// Labels for multi-language support
export const UserStatusLabels: Record<UserStatus, { en: string; kh: string }> =
  {
    [UserStatus.ACTIVE]: { en: 'Active', kh: 'សកម្ម' },
    [UserStatus.INACTIVE]: { en: 'Inactive', kh: 'អសកម្ម' },
    [UserStatus.SUSPENDED]: { en: 'Suspended', kh: 'ផ្អាក' },
    [UserStatus.PENDING_VERIFICATION]: {
      en: 'Pending Verification',
      kh: 'រង់ចាំការផ្ទៀងផ្ទាត់',
    },
  };

export const RoleStatusLabels: Record<RoleStatus, { en: string; kh: string }> =
  {
    [RoleStatus.ACTIVE]: { en: 'Active', kh: 'សកម្ម' },
    [RoleStatus.INACTIVE]: { en: 'Inactive', kh: 'អសកម្ម' },
  };

export const MenuStatusLabels: Record<MenuStatus, { en: string; kh: string }> =
  {
    [MenuStatus.ACTIVE]: { en: 'Active', kh: 'សកម្ម' },
    [MenuStatus.INACTIVE]: { en: 'Inactive', kh: 'អសកម្ម' },
    [MenuStatus.DRAFT]: { en: 'Draft', kh: 'ព្រាង' },
  };

// Colors for UI components (Ant Design)
export const UserStatusColors: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'success',
  [UserStatus.INACTIVE]: 'default',
  [UserStatus.SUSPENDED]: 'error',
  [UserStatus.PENDING_VERIFICATION]: 'warning',
};

export const RoleStatusColors: Record<RoleStatus, string> = {
  [RoleStatus.ACTIVE]: 'success',
  [RoleStatus.INACTIVE]: 'default',
};

export const MenuStatusColors: Record<MenuStatus, string> = {
  [MenuStatus.ACTIVE]: 'success',
  [MenuStatus.INACTIVE]: 'default',
  [MenuStatus.DRAFT]: 'warning',
};
