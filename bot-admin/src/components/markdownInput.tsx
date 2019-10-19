import { Divider, Typography } from '@material-ui/core';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import '../variables/react-draft.css';

interface IMarkdownInputAdapterProps {
    label: string;
    initialValue?: string;
    onChangeValue: (value: string) => void;
}

const MarkdownInputAdapter: React.FunctionComponent<IMarkdownInputAdapterProps> = props => {
    const { label, initialValue, onChangeValue } = props;
    const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(markdownToDraft(initialValue))));

    return (
        <div>
            <Typography variant="subtitle1">{label}</Typography>
            <Divider style={{ marginTop: 5, marginBottom: 5 }} />
            <Editor
                editorState={editorState}
                onEditorStateChange={e => {
                    setEditorState(e);
                    onChangeValue(draftToMarkdown(convertToRaw(e.getCurrentContent())));
                }}
                toolbar={{
                    options: ['blockType', 'inline', 'list', 'link', 'emoji', 'history'],
                    inline: {
                        inDropdown: false,
                        options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
                    },
                    list: {
                        inDropdown: false,
                        options: ['unordered', 'ordered', 'indent'],
                    },
                }}
            />
        </div>
    );
};

export default MarkdownInputAdapter;
