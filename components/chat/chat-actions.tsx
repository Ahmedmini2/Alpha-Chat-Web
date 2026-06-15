"use client";

import { createContext, useContext } from "react";

export interface ChatActions {
  /** Send text into the chat as if the user typed it (used by clickable cards). */
  send: (text: string) => void;
  /** True while a turn is in flight — clickable cards disable themselves. */
  busy: boolean;
}

const ChatActionsContext = createContext<ChatActions>({ send: () => {}, busy: false });

export function ChatActionsProvider({
  value,
  children,
}: {
  value: ChatActions;
  children: React.ReactNode;
}) {
  return <ChatActionsContext.Provider value={value}>{children}</ChatActionsContext.Provider>;
}

/** Cards call this to push a follow-up message (e.g. "select this project"). */
export function useChatActions(): ChatActions {
  return useContext(ChatActionsContext);
}
