import {createContext, useState} from "react";

export const ChatContext = createContext(['', (value: string) => {}]    );
// @ts-ignore
export const ChatContextProvider = ({ children }) => {
    const [chatId, setChatId] = useState('initial value');

    // @ts-ignore
    return (
        <ChatContext.Provider value={[ chatId, setChatId ]}>
            {children}
        </ChatContext.Provider>
    );
};
