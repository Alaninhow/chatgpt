import { httpsCallable } from 'firebase/functions';
import { ref, getDownloadURL } from 'firebase/storage';
import { functions, storage } from '../../firebaseConfig';

export async function createTicket({ ownerUid, type, price, validUntilMillis }) {
  const callable = httpsCallable(functions, 'createTicket');
  const { data } = await callable({ ownerUid, type, price, validUntilMillis });
  const { ticketId, qrStoragePath } = data;
  const url = await getDownloadURL(ref(storage, qrStoragePath));
  return { ticketId, qrStoragePath, qrUrl: url };
}
