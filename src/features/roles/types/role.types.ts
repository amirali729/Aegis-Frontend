export interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  /** Flat array of permission keys (strings), not objects or IDs. */
  permissions: string[];
  createdAt: string;
}