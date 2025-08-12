import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebaseConfig';

export async function createTicket({ ownerUid, type, price, validUntilMillis }) {
  const callable = httpsCallable(functions, 'createTicket');
  const { data } = await callable({ ownerUid, type, price, validUntilMillis });
  return data; // { ok, ticketId }
}

export async function validateTicket(ticketId) {
  const callable = httpsCallable(functions, 'validateTicket');
  const { data } = await callable({ ticketId });
  return data; // { ok: true }
}
