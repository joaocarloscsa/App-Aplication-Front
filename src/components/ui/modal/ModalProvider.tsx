"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { ConfirmModal } from "./ConfirmModal";
import { PromptModal } from "./PromptModal";
import { ModalState, ConfirmOptions, PromptOptions } from "./types";

type ModalContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);

  const close = () => {
    setModal(null);
    document.body.style.overflow = "";
  };

  const confirm = useCallback(
    (options: ConfirmOptions) => {
      if (modal) return Promise.resolve(false);

      document.body.style.overflow = "hidden";

      return new Promise<boolean>((resolve) => {
        setModal({ type: "confirm", options, resolve });
      });
    },
    [modal]
  );

  const prompt = useCallback(
    (options: PromptOptions) => {
      if (modal) return Promise.resolve(null);

      document.body.style.overflow = "hidden";

      return new Promise<string | null>((resolve) => {
        setModal({ type: "prompt", options, resolve });
      });
    },
    [modal]
  );

  return (
    <ModalContext.Provider value={{ confirm, prompt }}>
      {children}
      {modal &&
        createPortal(
          modal.type === "confirm" ? (
            <ConfirmModal
              options={modal.options}
              resolve={modal.resolve}
              onClose={close}
            />
          ) : (
            <PromptModal
              options={modal.options}
              resolve={modal.resolve}
              onClose={close}
            />
          ),
          document.body
        )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return ctx;
}
