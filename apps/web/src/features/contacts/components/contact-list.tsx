'use client';

import { useState } from 'react';
import { BriefcaseBusiness, Mail, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ContactForm } from './contact-form';
import { useContacts } from '../hooks/use-contacts';
import { useDeleteContact } from '../hooks/use-delete-contact';
import type { Contact } from '../types';

export function ContactList({ opportunityId }: { opportunityId: string }) {
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { contacts, isLoading, error, refetch } = useContacts(opportunityId);
  const { deleteContact, isDeleting } = useDeleteContact(opportunityId);
  const visibleContacts = contacts.filter((contact) => contact.id !== editingContact?.id);

  const remove = async (contact: Contact) => {
    if (!window.confirm(`Delete ${contact.name}?`)) return;
    await deleteContact(contact.id).catch(() => undefined);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Contacts</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Recruiters, hiring managers, and interviewers.
          </p>
        </div>
        {!isAdding && !editingContact && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add contact
          </Button>
        )}
      </CardHeader>
      {(isAdding || editingContact) && (
        <CardContent className="border-t border-slate-100 pt-5">
          <ContactForm
            key={editingContact?.id ?? 'new'}
            opportunityId={opportunityId}
            contact={editingContact ?? undefined}
            onCancel={() => {
              setIsAdding(false);
              setEditingContact(null);
            }}
          />
        </CardContent>
      )}
      <CardContent className={isAdding || editingContact ? 'pt-5' : 'pt-0'}>
        {isLoading && <LoadingState message="Loading contacts..." className="py-6" />}
        {error && (
          <ErrorState
            message="We could not load contacts."
            onRetry={() => void refetch()}
            className="mt-2"
          />
        )}
        {!isLoading && !error && visibleContacts.length === 0 && !isAdding && !editingContact && (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-7 text-center">
            <p className="text-sm font-medium text-slate-700">No contacts yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Add the people involved in this opportunity.
            </p>
          </div>
        )}
        {!isLoading && !error && visibleContacts.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {visibleContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                isDeleting={isDeleting}
                onEdit={() => {
                  setIsAdding(false);
                  setEditingContact(contact);
                }}
                onDelete={() => void remove(contact)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContactCard({
  contact,
  isDeleting,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">{contact.name}</h3>
          {contact.jobTitle && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              {contact.jobTitle}
            </p>
          )}
          {contact.relationship && (
            <p className="mt-2 text-xs font-medium text-blue-600">{contact.relationship}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Edit ${contact.name}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={isDeleting}
            aria-label={`Delete ${contact.name}`}
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-xs text-slate-600">
        {contact.email && (
          <a
            className="flex items-center gap-1.5 hover:text-blue-600"
            href={`mailto:${contact.email}`}
          >
            <Mail className="h-3.5 w-3.5" />
            {contact.email}
          </a>
        )}
        {contact.phone && (
          <a
            className="flex items-center gap-1.5 hover:text-blue-600"
            href={`tel:${contact.phone}`}
          >
            <Phone className="h-3.5 w-3.5" />
            {contact.phone}
          </a>
        )}
        {contact.linkedin && (
          <a
            className="block truncate text-blue-600 hover:underline"
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn profile
          </a>
        )}
      </div>
      {contact.notes && (
        <p className="mt-3 whitespace-pre-wrap border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600">
          {contact.notes}
        </p>
      )}
    </article>
  );
}
