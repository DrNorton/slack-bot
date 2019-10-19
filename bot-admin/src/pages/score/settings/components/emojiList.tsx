import { createStyles, GridList, GridListTile, IconButton, makeStyles, Theme } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { useState } from 'react';
import FlipMove from 'react-flip-move';

import { IEmojiDto } from '../../../../api/requests/emoji.dto';
import EmojiListItem from './emojiListItem';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        emoji: {
            fontSize: '32px',
        },
        itemBlock: {
            display: 'flex',
            padding: '5px',
            alignItems: 'center',
        },
        avatar: {
            border: `4px double ${theme.palette.primary.main}`,
            background: 'white',
            borderRadius: '20%',
            width: '90px',
            height: '90px',
        },
        selectedItemBlock: {
            border: `1px solid ${theme.palette.primary.main}`,
        },
        addEmojiButtonPanelRoot: {
            width: '100%',
            height: '100%',
        },
        addEmojiButtonPanelTile: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'white',
        },
        addButton: {
            color: 'white',
            background: theme.palette.primary.main,
        },
    }),
);

interface IEmojiListProps {
    emoji: IEmojiDto[];
    isFetching: boolean;
    onChange: (emoji: IEmojiDto) => void;
    onDelete: (emoji: IEmojiDto) => void;
    onAdd: () => void;
    isSelected: boolean;
}

const EmojiList: React.FunctionComponent<IEmojiListProps> = (props: IEmojiListProps) => {
    const styles = useStyles();
    const [selectedItem, setSelectedItem] = useState();
    const items = props.isFetching ? Array.from(new Array(props.emoji.length === 0 ? 10 : props.emoji.length)) : props.emoji;

    function onChange(changed: IEmojiDto, newScore: number): void {
        changed.scorePoints = newScore;
        props.onChange(changed);
    }

    const content = items.map((emoji, index) => (
        <FlipMove enterAnimation="accordionVertical" leaveAnimation="accordionVertical">
            <GridListTile onClick={() => setSelectedItem(emoji)} key={emoji ? emoji.name : index}>
                <EmojiListItem onDelete={props.onDelete} emoji={emoji} onChange={onChange} isSelected={emoji ? emoji === selectedItem : false} />
            </GridListTile>
        </FlipMove>
    ));
    return (
        <GridList style={{ margin: '5px' }} cols={4} spacing={20} cellHeight={100}>
            {content}
            <FlipMove enterAnimation="accordionVertical" leaveAnimation="accordionVertical">
                <GridListTile
                    className={styles.addEmojiButtonPanelRoot}
                    classes={{
                        tile: styles.addEmojiButtonPanelTile,
                    }}
                >
                    <IconButton onClick={props.onAdd} className={styles.addButton}>
                        <Add />
                    </IconButton>
                </GridListTile>
            </FlipMove>
        </GridList>
    );
};

export default EmojiList;
