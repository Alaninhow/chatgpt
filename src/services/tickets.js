// src/services/tickets.js
import { httpsCallable } from 'firebase/functions';
import { ref, getDownloadURL } from 'firebase/storage';
import { functions, storage } from '../../firebaseConfig'; // caminho: src/services -> raiz

/**
 * Chama a Cloud Function `createTicket` e retorna também a URL do QR no Storage.
 * Requer que você já tenha deployado a função no Firebase.
 */
export async function createTicket({ ownerUid, type, price, validUntilMillis }) {
  // chama a CF
  const callable = httpsCallable(functions, 'createTicket');
  const res = await callable({ ownerUid, type, price, validUntilMillis });
  const { ticketId, qrStoragePath } = res.data || {};

  // pega URL do PNG no Storage
  const url = await getDownloadURL(ref(storage, qrStoragePath));

  return { ticketId, qrStoragePath, qrUrl: url };
}
