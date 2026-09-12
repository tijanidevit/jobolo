'use client';

import { useParams } from 'next/navigation';
import { ContactList } from '@/features/contacts/components/contact-list';

export default function OpportunityContactsPage() {
  const { id } = useParams<{ id: string }>();
  return <ContactList opportunityId={id} />;
}
