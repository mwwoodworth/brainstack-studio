import { Conversation, UserPreferences } from '@/types';
import { STORAGE_KEYS, DEFAULT_PREFERENCES } from './constants';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Conversations
export function getConversations(): Conversation[] {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } catch (error) {
    console.error('Failed to save conversations:', error);
  }
}

export function getConversation(id: string): Conversation | null {
  const conversations = getConversations();
  return conversations.find((c) => c.id === id) || null;
}

export function saveConversation(conversation: Conversation): void {
  const conversations = getConversations();
  const index = conversations.findIndex((c) => c.id === conversation.id);

  if (index >= 0) {
    conversations[index] = conversation;
  } else {
    conversations.unshift(conversation);
  }

  saveConversations(conversations);
}

export function deleteConversation(id: string): void {
  const conversations = getConversations();
  const filtered = conversations.filter((c) => c.id !== id);
  saveConversations(filtered);
}

export function clearAllConversations(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
}

// Current conversation
export function getCurrentConversationId(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
}

export function setCurrentConversationId(id: string | null): void {
  if (!isBrowser) return;
  if (id) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
  }
}

// User preferences
export function getPreferences(): UserPreferences {
  if (!isBrowser) return DEFAULT_PREFERENCES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: Partial<UserPreferences>): void {
  if (!isBrowser) return;
  try {
    const current = getPreferences();
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify({ ...current, ...preferences }));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

export function resetPreferences(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
}

// Export all data (for backup)
export function exportAllData(): string {
  return JSON.stringify({
    conversations: getConversations(),
    preferences: getPreferences(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

// Import data (from backup)
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.conversations) {
      saveConversations(data.conversations);
    }
    if (data.preferences) {
      savePreferences(data.preferences);
    }
    return true;
  } catch {
    return false;
  }
}
