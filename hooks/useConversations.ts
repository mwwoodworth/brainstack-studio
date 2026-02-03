'use client';

import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from '@/types';
import { generateId, extractTitle } from '@/lib/utils';
import {
  getConversations,
  saveConversation,
  deleteConversation as deleteConv,
  getCurrentConversationId,
  setCurrentConversationId,
  getPreferences,
} from '@/lib/storage';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const stored = getConversations();
    setConversations(stored);

    const currentId = getCurrentConversationId();
    if (currentId) {
      const current = stored.find((c) => c.id === currentId);
      if (current) {
        setCurrentConversation(current);
      }
    }
    setIsLoaded(true);
  }, []);

  const createConversation = useCallback((model?: string): Conversation => {
    const preferences = getPreferences();
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      model: model || preferences.defaultModel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      systemPrompt: preferences.systemPrompt,
    };

    saveConversation(newConversation);
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    setCurrentConversationId(newConversation.id);

    return newConversation;
  }, []);

  const selectConversation = useCallback((id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
      setCurrentConversationId(id);
    }
  }, [conversations]);

  const updateConversation = useCallback((id: string, updates: Partial<Conversation>) => {
    setConversations((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index < 0) return prev;

      const updated = { ...prev[index], ...updates, updatedAt: Date.now() };
      saveConversation(updated);

      const newConversations = [...prev];
      newConversations[index] = updated;

      return newConversations;
    });

    // Update current conversation separately using functional update to avoid stale closure
    setCurrentConversation((prev) => {
      if (prev?.id === id) {
        return { ...prev, ...updates, updatedAt: Date.now() };
      }
      return prev;
    });
  }, []);

  const addMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Message => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    };

    setConversations((prev) => {
      const index = prev.findIndex((c) => c.id === conversationId);
      if (index < 0) return prev;

      const conversation = prev[index];
      const messages = [...conversation.messages, newMessage];

      // Update title if this is the first user message
      let title = conversation.title;
      if (messages.filter((m) => m.role === 'user').length === 1 && message.role === 'user') {
        title = extractTitle(message.content);
      }

      const updated: Conversation = {
        ...conversation,
        messages,
        title,
        updatedAt: Date.now(),
      };

      saveConversation(updated);

      const newConversations = [...prev];
      newConversations[index] = updated;

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(updated);
      }

      return newConversations;
    });

    return newMessage;
  }, [currentConversation]);

  const updateMessage = useCallback((conversationId: string, messageId: string, content: string) => {
    setConversations((prev) => {
      const convIndex = prev.findIndex((c) => c.id === conversationId);
      if (convIndex < 0) return prev;

      const conversation = prev[convIndex];
      const messages = conversation.messages.map((m) =>
        m.id === messageId ? { ...m, content } : m
      );

      const updated: Conversation = {
        ...conversation,
        messages,
        updatedAt: Date.now(),
      };

      saveConversation(updated);

      const newConversations = [...prev];
      newConversations[convIndex] = updated;

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(updated);
      }

      return newConversations;
    });
  }, [currentConversation]);

  const deleteConversation = useCallback((id: string) => {
    deleteConv(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));

    if (currentConversation?.id === id) {
      setCurrentConversation(null);
      setCurrentConversationId(null);
    }
  }, [currentConversation]);

  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
    setCurrentConversationId(null);
  }, []);

  const reloadConversations = useCallback(() => {
    const stored = getConversations();
    setConversations(stored);

    const currentId = getCurrentConversationId();
    if (currentId) {
      const current = stored.find((c) => c.id === currentId) || null;
      setCurrentConversation(current);
    } else {
      setCurrentConversation(null);
    }
  }, []);

  return {
    conversations,
    currentConversation,
    isLoaded,
    createConversation,
    selectConversation,
    updateConversation,
    addMessage,
    updateMessage,
    deleteConversation,
    clearCurrentConversation,
    reloadConversations,
  };
}
