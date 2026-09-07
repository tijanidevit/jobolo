'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCreateContact } from '../hooks/use-create-contact';
import { useUpdateContact } from '../hooks/use-update-contact';
import type { Contact } from '../types';
import { contactSchema, type ContactFormValues } from '../schemas/contact.schema';

export function ContactForm({
  opportunityId,
  contact,
  onCancel,
}: {
  opportunityId: string;
  contact?: Contact;
  onCancel: () => void;
}) {
  const { createContact, isCreating } = useCreateContact(opportunityId);
  const { updateContact, isUpdating } = useUpdateContact(opportunityId, contact?.id ?? '');
  const isSaving = isCreating || isUpdating;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name ?? '',
      jobTitle: contact?.jobTitle ?? '',
      email: contact?.email ?? '',
      phone: contact?.phone ?? '',
      linkedin: contact?.linkedin ?? '',
      relationship: contact?.relationship ?? '',
      notes: contact?.notes ?? '',
    },
  });

  const submit = async (values: ContactFormValues) => {
    const payload = {
      ...values,
      jobTitle: values.jobTitle || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      linkedin: values.linkedin || undefined,
      relationship: values.relationship || undefined,
      notes: values.notes || undefined,
    };
    if (contact) await updateContact(payload);
    else await createContact(payload);
    onCancel();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contact ? 'Edit contact' : 'Add contact'}</CardTitle>
        <p className="text-sm text-slate-500">Keep the people connected to this opportunity close.</p>
      </CardHeader>
      <form onSubmit={handleSubmit(submit)}>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" error={errors.name?.message} required>
            <Input {...register('name')} placeholder="Sarah Johnson" disabled={isSaving} />
          </Field>
          <Field label="Job title" error={errors.jobTitle?.message}>
            <Input {...register('jobTitle')} placeholder="Technical Recruiter" disabled={isSaving} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input {...register('email')} type="email" placeholder="sarah@example.com" disabled={isSaving} />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input {...register('phone')} type="tel" placeholder="+1 555 123 4567" disabled={isSaving} />
          </Field>
          <Field label="LinkedIn" error={errors.linkedin?.message}>
            <Input {...register('linkedin')} type="url" placeholder="https://linkedin.com/in/..." disabled={isSaving} />
          </Field>
          <Field label="Relationship" error={errors.relationship?.message}>
            <Input {...register('relationship')} placeholder="Recruiter, hiring manager..." disabled={isSaving} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes" error={errors.notes?.message}>
              <textarea
                {...register('notes')}
                rows={4}
                placeholder="What should you remember about this person?"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                disabled={isSaving}
              />
            </Field>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t border-slate-100 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save contact'}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
      {error && <span className="block text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}
