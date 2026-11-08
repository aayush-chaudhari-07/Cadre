import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from '@/features/workspace';
import {
  fetchMeetings,
  fetchMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  type MeetingInsert,
  type MeetingUpdate,
  type MeetingRow,
} from './api';
import { analyzeMeeting } from '@/lib/ai';
import type { MeetingAnalysis } from '@/types/ai';

export function useMeetings(search?: string) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<MeetingRow[]>({
    queryKey: ['meetings', orgId, search],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchMeetings(orgId, search);
    },
    enabled: Boolean(orgId),
    staleTime: 30 * 1000,
  });
}

export function useMeeting(meetingId?: string) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<MeetingRow | null>({
    queryKey: ['meeting', orgId, meetingId],
    queryFn: () => {
      if (!orgId || !meetingId) throw new Error('Missing workspace or meeting ID');
      return fetchMeetingById(meetingId, orgId);
    },
    enabled: Boolean(orgId && meetingId),
    staleTime: 60 * 1000,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: (meeting: Omit<MeetingInsert, 'org_id'>) => {
      if (!orgId) throw new Error('No active workspace');
      return createMeeting({
        ...meeting,
        org_id: orgId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings', orgId] });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MeetingUpdate }) => {
      if (!orgId) throw new Error('No active workspace');
      return updateMeeting(id, orgId, updates);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', orgId] });
      queryClient.invalidateQueries({ queryKey: ['meeting', orgId, updated.id] });
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: (id: string) => {
      if (!orgId) throw new Error('No active workspace');
      return deleteMeeting(id, orgId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings', orgId] });
    },
  });
}

export function useAnalyzeMeeting() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation<
    MeetingAnalysis,
    Error,
    { meetingId?: string; title: string; transcript: string; company?: string }
  >({
    mutationFn: async ({ meetingId, title, transcript, company }) => {
      if (!orgId) throw new Error('No active workspace');
      return analyzeMeeting({
        orgId,
        meetingId,
        title,
        transcript,
        company,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', orgId] });
      if (variables.meetingId) {
        queryClient.invalidateQueries({ queryKey: ['meeting', orgId, variables.meetingId] });
      }
      queryClient.invalidateQueries({ queryKey: ['ai_usage'] });
    },
  });
}
