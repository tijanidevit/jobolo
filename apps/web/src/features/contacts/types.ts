export interface Contact {
  id: string;
  userId: string;
  opportunityId: string;
  name: string;
  jobTitle: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  relationship: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ContactPayload = {
  name: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  relationship?: string;
  notes?: string;
};
