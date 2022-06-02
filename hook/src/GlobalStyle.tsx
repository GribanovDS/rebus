import React, { FC, useRef, useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { createAssistant, AssistantAppState, CharacterId } from '@salutejs/client';
import { darkJoy, darkEva, darkSber } from '@salutejs/plasma-tokens/themes';
import {
    text, // Цвет текста
    background, // Цвет подложки
    gradient, // Градиент
} from '@salutejs/plasma-tokens';
import { gridColumns } from '@salutejs/plasma-ui';

const ThemeBackgroundEva = createGlobalStyle(darkEva);
const ThemeBackgroundSber = createGlobalStyle(darkSber);
const ThemeBackgroundJoy = createGlobalStyle(darkJoy);

const initializeAssistant = (getState: any) => {
    return createAssistant({ getState });
};

const DocumentStyle = createGlobalStyle`
    html {
        color: ${text};
        background-color: ${background};
        background-image: ${gradient};
        min-height: 100vh;
    }
`;
const ThemeStyle = createGlobalStyle(darkSber);

export const GlobalStyle = () => (
    <React.StrictMode>
        <DocumentStyle />
        <ThemeStyle />
    </React.StrictMode>
 );

 export default function Ass() {
    const [character, setCharacter] = useState('sber' as CharacterId);

    const assistantStateRef = useRef<AssistantAppState>();
    const assistantRef = useRef<ReturnType<typeof createAssistant>>();

    useEffect(() => {
        assistantRef.current = initializeAssistant(() => assistantStateRef.current);
        assistantRef.current.on('data', (command) => {
            switch (command.type) {
                case 'character':
                    setCharacter(command.character.id);
                    // 'sber' | 'eva' | 'joy';
                    break;
                case 'navigation':
                    break;
                case 'smart_app_data':
                    break;
                default:
                    return;
            }
        });
    }, []);

    return (
        <div>
            {(() => {
                switch (character) {
                    case 'sber':
                        return <ThemeBackgroundSber />;
                    case 'eva':
                        return <ThemeBackgroundEva />;
                    case 'joy':
                        return <ThemeBackgroundJoy />;
                    default:
                        return;
                }
            })()}
        </div>
    );
}