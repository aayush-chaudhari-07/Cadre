export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LeadStatus = 'new' | 'hot' | 'warm' | 'cold' | 'won' | 'lost';
export type LeadIntent = 'high' | 'medium' | 'low';
export type DealStage = 'prospecting' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type AccountRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type MeetingSentiment = 'positive' | 'neutral' | 'negative';
export type AgentAutonomy = 'off' | 'suggest' | 'auto';
export type CeoPlanStatus = 'draft' | 'approved' | 'done';
export type OrgRole = 'owner' | 'admin' | 'member';
export type OrgPlan = 'free' | 'pro' | 'scale';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          plan: OrgPlan;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          plan?: OrgPlan;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          plan?: OrgPlan;
          created_at?: string;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          org_id: string;
          user_id: string;
          role: OrgRole;
          created_at: string;
        };
        Insert: {
          org_id: string;
          user_id: string;
          role?: OrgRole;
          created_at?: string;
        };
        Update: {
          org_id?: string;
          user_id?: string;
          role?: OrgRole;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'memberships_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      leads: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          company: string | null;
          email: string | null;
          source: string | null;
          status: LeadStatus;
          score: number | null;
          deal_value: number;
          probability: number | null;
          intent: LeadIntent | null;
          summary: string | null;
          next_action: string | null;
          objections: Json;
          last_contact_at: string | null;
          is_demo: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          company?: string | null;
          email?: string | null;
          source?: string | null;
          status?: LeadStatus;
          score?: number | null;
          deal_value?: number;
          probability?: number | null;
          intent?: LeadIntent | null;
          summary?: string | null;
          next_action?: string | null;
          objections?: Json;
          last_contact_at?: string | null;
          is_demo?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          company?: string | null;
          email?: string | null;
          source?: string | null;
          status?: LeadStatus;
          score?: number | null;
          deal_value?: number;
          probability?: number | null;
          intent?: LeadIntent | null;
          summary?: string | null;
          next_action?: string | null;
          objections?: Json;
          last_contact_at?: string | null;
          is_demo?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'leads_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      lead_interactions: {
        Row: {
          id: string;
          org_id: string;
          lead_id: string;
          channel: 'email' | 'chat' | 'call' | 'note';
          content: string;
          analysis: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          lead_id: string;
          channel?: 'email' | 'chat' | 'call' | 'note';
          content: string;
          analysis?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          lead_id?: string;
          channel?: 'email' | 'chat' | 'call' | 'note';
          content?: string;
          analysis?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lead_interactions_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lead_interactions_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      deals: {
        Row: {
          id: string;
          org_id: string;
          lead_id: string | null;
          name: string;
          amount: number;
          stage: DealStage;
          probability: number;
          expected_close: string | null;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          lead_id?: string | null;
          name: string;
          amount?: number;
          stage?: DealStage;
          probability?: number;
          expected_close?: string | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          lead_id?: string | null;
          name?: string;
          amount?: number;
          stage?: DealStage;
          probability?: number;
          expected_close?: string | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'deals_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deals_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      accounts: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          plan: string | null;
          mrr: number;
          health_score: number | null;
          risk_level: AccountRiskLevel | null;
          signals: Json;
          last_analysis: Json | null;
          renewal_date: string | null;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          plan?: string | null;
          mrr?: number;
          health_score?: number | null;
          risk_level?: AccountRiskLevel | null;
          signals?: Json;
          last_analysis?: Json | null;
          renewal_date?: string | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          plan?: string | null;
          mrr?: number;
          health_score?: number | null;
          risk_level?: AccountRiskLevel | null;
          signals?: Json;
          last_analysis?: Json | null;
          renewal_date?: string | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'accounts_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      meetings: {
        Row: {
          id: string;
          org_id: string;
          title: string;
          company: string | null;
          held_at: string;
          transcript: string;
          summary: string | null;
          sentiment: MeetingSentiment | null;
          action_items: Json;
          objections: Json;
          analysis: Json | null;
          is_demo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          title: string;
          company?: string | null;
          held_at?: string;
          transcript: string;
          summary?: string | null;
          sentiment?: MeetingSentiment | null;
          action_items?: Json;
          objections?: Json;
          analysis?: Json | null;
          is_demo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          title?: string;
          company?: string | null;
          held_at?: string;
          transcript?: string;
          summary?: string | null;
          sentiment?: MeetingSentiment | null;
          action_items?: Json;
          objections?: Json;
          analysis?: Json | null;
          is_demo?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'meetings_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      competitors: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          url: string;
          last_scanned_at: string | null;
          analysis: Json | null;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          url: string;
          last_scanned_at?: string | null;
          analysis?: Json | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          url?: string;
          last_scanned_at?: string | null;
          analysis?: Json | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'competitors_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      agents: {
        Row: {
          id: string;
          org_id: string;
          key: string;
          name: string;
          role: string | null;
          autonomy: AgentAutonomy;
          enabled: boolean;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          key: string;
          name: string;
          role?: string | null;
          autonomy?: AgentAutonomy;
          enabled?: boolean;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          key?: string;
          name?: string;
          role?: string | null;
          autonomy?: AgentAutonomy;
          enabled?: boolean;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'agents_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      agent_runs: {
        Row: {
          id: string;
          org_id: string;
          agent_key: string;
          action: string;
          status: 'done' | 'failed';
          summary: string | null;
          output: Json | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          agent_key: string;
          action: string;
          status?: 'done' | 'failed';
          summary?: string | null;
          output?: Json | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          agent_key?: string;
          action?: string;
          status?: 'done' | 'failed';
          summary?: string | null;
          output?: Json | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'agent_runs_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      ceo_plans: {
        Row: {
          id: string;
          org_id: string;
          command: string;
          plan: Json;
          status: CeoPlanStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          command: string;
          plan: Json;
          status?: CeoPlanStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          command?: string;
          plan?: Json;
          status?: CeoPlanStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ceo_plans_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      insights: {
        Row: {
          id: string;
          org_id: string;
          for_date: string;
          content: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          for_date?: string;
          content: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          for_date?: string;
          content?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'insights_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_usage: {
        Row: {
          user_id: string;
          usage_date: string;
          calls: number;
        };
        Insert: {
          user_id: string;
          usage_date?: string;
          calls?: number;
        };
        Update: {
          user_id?: string;
          usage_date?: string;
          calls?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      consume_ai_quota: {
        Args: {
          p_limit?: number;
        };
        Returns: boolean;
      };
      create_organization: {
        Args: {
          p_name: string;
        };
        Returns: string;
      };
      seed_demo_data: {
        Args: {
          p_org: string;
        };
        Returns: void;
      };
      clear_demo_data: {
        Args: {
          p_org: string;
        };
        Returns: void;
      };
      is_org_member: {
        Args: {
          p_org: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
