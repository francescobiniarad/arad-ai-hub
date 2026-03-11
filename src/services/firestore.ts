import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { getCurrentUser } from './auth';
import type {
  Stream,
  Idea,
  Certification,
  PracticalSession,
  Workshop,
  AIOffering,
  UpdateLogEntry,
  Proposal,
} from '../types';

// Collection names
const COLLECTIONS = {
  streams: 'streams',
  ideas: 'ideas',
  certifications: 'certifications',
  practicalSessions: 'practical_sessions',
  workshops: 'workshops',
  aiOfferings: 'ai_offerings',
  updatesLog: 'updates_log',
  proposals: 'proposals',
} as const;

// Log a change to the audit trail
const logChange = async (
  collectionName: string,
  documentId: string,
  fieldChanged: string,
  oldValue: unknown,
  newValue: unknown,
  _reason?: string
): Promise<void> => {
  const user = getCurrentUser();
  if (!user) return;

  try {
    await addDoc(collection(db, COLLECTIONS.updatesLog), {
      timestamp: serverTimestamp(),
      userEmail: user.email,
      collection: collectionName,
      documentId,
      fieldChanged,
      oldValue: JSON.parse(JSON.stringify(oldValue)),
      newValue: JSON.parse(JSON.stringify(newValue)),
    });
  } catch (error) {
    console.error('Failed to log change:', error);
  }
};

// Streams
export const subscribeToStreams = (
  callback: (streams: Stream[]) => void
): (() => void) => {
  const q = query(collection(db, COLLECTIONS.streams));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const streams = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Stream[];
    callback(streams);
  });
};

export const deleteStream = async (streamId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.streams, streamId);
  const existing = await getDoc(docRef);
  await deleteDoc(docRef);
  await logChange(COLLECTIONS.streams, streamId, 'deleted', existing.data(), null);
};

export const saveStream = async (stream: Stream): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.streams, stream.id);
  const existing = await getDoc(docRef);
  const data = { name: stream.name, leader: stream.leader, substreams: stream.substreams };

  if (existing.exists()) {
    await setDoc(docRef, data);
    await logChange(COLLECTIONS.streams, stream.id, 'updated', existing.data(), data);
  } else {
    await setDoc(docRef, data);
    await logChange(COLLECTIONS.streams, stream.id, 'created', null, data);
  }
};

// Ideas
export const subscribeToIdeas = (
  callback: (ideas: Idea[]) => void
): (() => void) => {
  const q = query(collection(db, COLLECTIONS.ideas));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const ideas = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Idea[];
    callback(ideas);
  });
};

export const saveIdea = async (idea: Idea): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ideas, idea.id);
  const existing = await getDoc(docRef);
  const data = {
    ideaId: idea.ideaId,
    text: idea.text,
    description: idea.description,
    streamId: idea.streamId,
    substreamId: idea.substreamId,
    col: idea.col,
    partenza: idea.partenza,
    arrivo: idea.arrivo,
  };

  if (existing.exists()) {
    await setDoc(docRef, data);
    await logChange(COLLECTIONS.ideas, idea.id, 'updated', existing.data(), data);
  } else {
    await setDoc(docRef, data);
    await logChange(COLLECTIONS.ideas, idea.id, 'created', null, data);
  }
};

export const deleteIdea = async (ideaId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ideas, ideaId);
  const existing = await getDoc(docRef);
  await deleteDoc(docRef);
  await logChange(COLLECTIONS.ideas, ideaId, 'deleted', existing.data(), null);
};

// Certifications
export const subscribeToCertifications = (
  callback: (certs: Certification[]) => void
): (() => void) => {
  const q = query(collection(db, COLLECTIONS.certifications));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const certs = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Certification[];
    callback(certs);
  });
};

export const saveCertification = async (cert: Certification): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.certifications, cert.id);
  const data = {
    name: cert.name,
    provider: cert.provider,
    description: cert.description,
    level: cert.level,
    members: cert.members,
  };
  await setDoc(docRef, data, { merge: true });
};

export const deleteCertification = async (certId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.certifications, certId);
  const existing = await getDoc(docRef);
  await deleteDoc(docRef);
  await logChange(COLLECTIONS.certifications, certId, 'deleted', existing.data(), null);
};

// Practical Sessions
export const subscribeToPracticalSessions = (
  callback: (sessions: PracticalSession[]) => void
): (() => void) => {
  const q = query(collection(db, COLLECTIONS.practicalSessions));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const sessions = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as PracticalSession[];
    callback(sessions);
  });
};

export const savePracticalSession = async (session: PracticalSession): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.practicalSessions, session.id);
  const data = {
    date: session.date,
    topic: session.topic,
    referente: session.referente,
    theory: session.theory,
    practice: session.practice,
  };
  await setDoc(docRef, data, { merge: true });
};

export const deletePracticalSession = async (sessionId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.practicalSessions, sessionId);
  const existing = await getDoc(docRef);
  await deleteDoc(docRef);
  await logChange(COLLECTIONS.practicalSessions, sessionId, 'deleted', existing.data(), null);
};

// Workshops
export const subscribeToWorkshops = (
  callback: (workshops: Workshop[]) => void
): (() => void) => {
  const q = query(collection(db, COLLECTIONS.workshops));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const workshops = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Workshop[];
    callback(workshops);
  });
};

export const saveWorkshop = async (workshop: Workshop): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.workshops, workshop.id);
  const data = {
    date: workshop.date,
    topic: workshop.topic,
    leader: workshop.leader,
    notes: workshop.notes,
  };
  await setDoc(docRef, data, { merge: true });
};

export const deleteWorkshop = async (workshopId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.workshops, workshopId);
  const existing = await getDoc(docRef);
  await deleteDoc(docRef);
  await logChange(COLLECTIONS.workshops, workshopId, 'deleted', existing.data(), null);
};

// AI Offerings
export const subscribeToAIOfferings = (
  callback: (offerings: AIOffering[]) => void
): (() => void) => {
  const q = query(collection(db, COLLECTIONS.aiOfferings));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const offerings = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as AIOffering[];
    callback(offerings);
  });
};

export const saveAIOffering = async (offering: AIOffering): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.aiOfferings, offering.id);
  const existing = await getDoc(docRef);
  const data = {
    stream: offering.stream,
    title: offering.title,
    description: offering.description,
    valueProp: offering.valueProp,
    sforzo: offering.sforzo,
    appetibilita: offering.appetibilita,
    noteAM: offering.noteAM,
  };

  if (existing.exists()) {
    await setDoc(docRef, data);
    await logChange(COLLECTIONS.aiOfferings, offering.id, 'updated', existing.data(), data);
  } else {
    await setDoc(docRef, data);
    await logChange(COLLECTIONS.aiOfferings, offering.id, 'created', null, data);
  }
};

// Proposals
export const saveProposal = async (proposal: Omit<Proposal, 'id' | 'createdAt'>): Promise<void> => {
  await addDoc(collection(db, COLLECTIONS.proposals), {
    ...proposal,
    createdAt: serverTimestamp(),
  });
};

export const subscribeToProposals = (
  callback: (proposals: Proposal[]) => void
): (() => void) => {
  const q = query(collection(db, COLLECTIONS.proposals), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const proposals = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        titolo: data.titolo,
        descrizione: data.descrizione,
        perche: data.perche,
        asIs: data.asIs,
        toBe: data.toBe,
        streamId: data.streamId,
        roi: data.roi,
        tipologia: data.tipologia,
        email: data.email,
        createdAt: (data.createdAt as Timestamp)?.toDate(),
      };
    }) as Proposal[];
    callback(proposals);
  });
};

// Updates Log
export const subscribeToUpdatesLog = (
  callback: (entries: UpdateLogEntry[]) => void,
  limitCount = 100
): (() => void) => {
  const q = query(
    collection(db, COLLECTIONS.updatesLog),
    orderBy('timestamp', 'desc')
  );
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const entries = snapshot.docs.slice(0, limitCount).map((d) => {
      const data = d.data();
      return {
        id: d.id,
        timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
        userEmail: data.userEmail,
        collection: data.collection,
        documentId: data.documentId,
        fieldChanged: data.fieldChanged,
        oldValue: data.oldValue,
        newValue: data.newValue,
        reason: data.reason,
      };
    }) as UpdateLogEntry[];
    callback(entries);
  });
};
