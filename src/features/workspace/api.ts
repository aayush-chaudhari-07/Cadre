import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Membership = Database['public']['Tables']['memberships']['Row'];

/**
 * Creates an organization via the secure RPC function.
 * Automatically provisions the 6 AI agents and owner membership.
 * Optionally populates realistic sample data.
 */
export async function createWorkspace(name: string, seedSampleData: boolean = true): Promise<string> {
  const trimmed = name.trim();

  const { data: orgId, error: createError } = await supabase.rpc('create_organization', {
    p_name: trimmed,
  });

  if (createError) throw createError;
  if (!orgId) throw new Error('Failed to create workspace: no ID returned');

  if (seedSampleData) {
    const { error: seedError } = await supabase.rpc('seed_demo_data', {
      p_org: orgId,
    });
    if (seedError) {
      console.error('Failed to seed demo data for new workspace:', seedError);
      // Non-fatal error: workspace was created successfully
    }
  }

  return orgId;
}

/**
 * Seeds demo data into the given workspace.
 */
export async function seedWorkspaceDemoData(orgId: string): Promise<void> {
  const { error } = await supabase.rpc('seed_demo_data', {
    p_org: orgId,
  });
  if (error) throw error;
}

/**
 * Clears demo data from the given workspace without affecting real data.
 */
export async function clearWorkspaceDemoData(orgId: string): Promise<void> {
  const { error } = await supabase.rpc('clear_demo_data', {
    p_org: orgId,
  });
  if (error) throw error;
}

/**
 * Loads the user's primary membership and associated organization.
 */
export async function fetchUserPrimaryWorkspace(userId: string): Promise<{
  membership: Membership;
  organization: Organization;
} | null> {
  const { data, error } = await supabase
    .from('memberships')
    .select('org_id, user_id, role, created_at, organizations(id, name, owner_id, plan, created_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.organizations) return null;

  const org = Array.isArray(data.organizations) ? data.organizations[0] : data.organizations;
  if (!org) return null;

  return {
    membership: {
      org_id: data.org_id,
      user_id: data.user_id,
      role: data.role,
      created_at: data.created_at,
    },
    organization: org,
  };
}
