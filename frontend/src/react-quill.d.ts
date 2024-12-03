declare module 'react-quill' {
    import * as React from 'react';

    export interface ReactQuillProps {
        value: string;
        onChange: (content: string, delta: any, source: string, editor: any) => void;
        modules?: any;
        formats?: string[];
        bounds?: string | HTMLElement;
        theme?: string;
        readOnly?: boolean;
        placeholder?: string;
        className?: string;
    }

    const ReactQuill: React.FC<ReactQuillProps>;
    export default ReactQuill;
}
