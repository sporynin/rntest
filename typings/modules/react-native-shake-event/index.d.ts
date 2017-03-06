declare module 'react-native-shake-event' {

    export function addEventListener(type: string, handler : () => void): void;
    export function removeEventListener(type: string): void;
}
