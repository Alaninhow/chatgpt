const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

admin.initializeApp();
const db = admin.firestore();

/**
 * Cria um ticket no Firestore e devolve o ticketId
 * data: { ownerUid, type, price, validUntilMillis }
 */
exports.createTicket = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Faça login.');

  const { ownerUid, type, price, validUntilMillis } = data || {};
  if (!ownerUid || !type || typeof price !== 'number' || !validUntilMillis) {
    throw new functions.https.HttpsError('invalid-argument', 'Parâmetros inválidos.');
  }
  if (ownerUid !== context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'Sem permissão.');
  }

  const ticketId = uuidv4();
  const validUntil = admin.firestore.Timestamp.fromMillis(validUntilMillis);

  await db.collection('tickets').doc(ticketId).set({
    ownerUid,
    type,
    price,
    status: 'active',
    redeemed: false,
    validUntil,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    redeemedAt: null,
    redeemedByUid: null,
  });

  return { ok: true, ticketId };
});

/**
 * Valida ticket (uso único)
 * data: { ticketId }
 */
exports.validateTicket = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Faça login.');

  const { ticketId } = data || {};
  if (!ticketId) throw new functions.https.HttpsError('invalid-argument', 'ticketId obrigatório');

  const ref = db.collection('tickets').doc(ticketId);
  const snap = await ref.get();
  if (!snap.exists) throw new functions.https.HttpsError('not-found', 'Ticket não encontrado');

  const t = snap.data();

  if (t.redeemed) throw new functions.https.HttpsError('failed-precondition', 'Ticket já utilizado');
  if (new Date() > t.validUntil.toDate()) {
    throw new functions.https.HttpsError('failed-precondition', 'Ticket expirado');
  }

  await ref.update({
    redeemed: true,
    redeemedAt: admin.firestore.FieldValue.serverTimestamp(),
    redeemedByUid: context.auth.uid,
  });

  await db.collection('validation_logs').add({
    ticketId,
    validatedBy: context.auth.uid,
    validatedAt: admin.firestore.FieldValue.serverTimestamp(),
    ticketType: t.type,
    ticketPrice: t.price,
  });

  return { ok: true };
});
