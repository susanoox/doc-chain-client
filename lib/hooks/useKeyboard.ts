import { useEffect } from "react";

type KeyCombo = string;
type Handler = (event: KeyboardEvent) => void;

export const useKeyboard = (combos: Record<KeyCombo, Handler>) => {
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         const { key, ctrlKey, metaKey, shiftKey, altKey } = event;

         // Build the current combo string
         const modifiers = [];
         if (ctrlKey || metaKey) modifiers.push("cmd");
         if (shiftKey) modifiers.push("shift");
         if (altKey) modifiers.push("alt");

         const combo = [...modifiers, key.toLowerCase()].join("+");

         // Check if this combo has a handler
         if (combos[combo]) {
            event.preventDefault();
            combos[combo](event);
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [combos]);
};

// Common keyboard shortcuts
export const KeyboardShortcuts = {
   SEARCH: "cmd+k",
   NEW_DOCUMENT: "cmd+n",
   SAVE: "cmd+s",
   DELETE: "cmd+backspace",
   SELECT_ALL: "cmd+a",
   ESCAPE: "escape",
   ENTER: "enter",
};
