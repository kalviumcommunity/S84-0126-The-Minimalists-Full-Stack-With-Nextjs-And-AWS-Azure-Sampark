import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * Provides accessible keyboard navigation throughout the app
 * 
 * @param key - The keyboard key to listen for (e.g., 'k', 'Escape', '/')
 * @param callback - Function to call when key is pressed
 * @param modifiers - Optional modifier keys (ctrl, alt, shift, meta)
 */

interface KeyboardShortcutOptions {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean; // Command on Mac, Windows key on Windows
  preventDefault?: boolean;
}

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options: KeyboardShortcutOptions = {}
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if modifiers match
      const ctrlMatch = options.ctrl === undefined || event.ctrlKey === options.ctrl;
      const altMatch = options.alt === undefined || event.altKey === options.alt;
      const shiftMatch = options.shift === undefined || event.shiftKey === options.shift;
      const metaMatch = options.meta === undefined || event.metaKey === options.meta;

      // Check if the pressed key matches (case-insensitive)
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();

      // If all conditions match, execute callback
      if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
        if (options.preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, options]);
};

/**
 * Common keyboard shortcuts used in the app
 * 
 * Usage example:
 * ```tsx
 * import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
 * 
 * function MyComponent() {
 *   useKeyboardShortcut('k', () => {
 *     console.log('Search opened');
 *   }, { ctrl: true, preventDefault: true });
 * }
 * ```
 * 
 * Default shortcuts:
 * - Ctrl/Cmd + K: Open search
 * - Escape: Close modals/dialogs
 * - ?: Show keyboard shortcuts help
 * - /: Focus search input
 */

export default useKeyboardShortcut;
