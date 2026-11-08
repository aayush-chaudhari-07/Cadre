import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Loader2, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/features/auth';
import { updateProfile } from '../api';
import { profileFormSchema, type ProfileFormValues } from '../schemas';
import { toast } from 'sonner';

export function ProfileTab() {
  const { user, profile, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      display_name: profile?.display_name || '',
      avatar_url: profile?.avatar_url || '',
    },
  });

  const watchedAvatarUrl = watch('avatar_url');
  const watchedName = watch('display_name');

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(user.id, {
        display_name: values.display_name.trim(),
        avatar_url: values.avatar_url?.trim() || null,
      });
      await refreshProfile();
      toast.success('Profile changes saved successfully');
    } catch (err) {
      toast.error(`Failed to update profile: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (watchedName || user?.email || 'U')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="glass border-[var(--border)]">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--primary)]" />
          <span>Personal Profile</span>
        </CardTitle>
        <CardDescription>
          Update your display identity and avatar across Cadre workspace reports.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Avatar Preview Row */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
            <Avatar className="w-14 h-14 border border-[var(--border)]">
              <AvatarImage src={watchedAvatarUrl} alt={watchedName || 'User'} />
              <AvatarFallback className="bg-[var(--primary)]/10 text-[var(--primary)] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--text)]">
                {watchedName || 'Your Name'}
              </p>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-md">
            {/* Display Name Input */}
            <div className="space-y-2">
              <Label htmlFor="display_name" className="text-xs">
                Display Name <span className="text-[var(--danger)]">*</span>
              </Label>
              <Input
                id="display_name"
                {...register('display_name')}
                placeholder="e.g. Alex Morgan"
                className="text-sm"
              />
              {errors.display_name && (
                <p className="text-xs text-[var(--danger)]">
                  {errors.display_name.message}
                </p>
              )}
            </div>

            {/* Avatar URL Input */}
            <div className="space-y-2">
              <Label htmlFor="avatar_url" className="text-xs">
                Avatar Image URL (Optional)
              </Label>
              <Input
                id="avatar_url"
                {...register('avatar_url')}
                placeholder="https://example.com/avatar.jpg"
                className="text-sm"
              />
              {errors.avatar_url && (
                <p className="text-xs text-[var(--danger)]">
                  {errors.avatar_url.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-[var(--border)] flex justify-end">
          <Button
            type="submit"
            disabled={isSaving || !isDirty}
            className="gap-2 text-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

