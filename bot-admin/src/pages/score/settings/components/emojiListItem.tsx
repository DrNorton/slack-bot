import { Avatar, createStyles, Divider, IconButton, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';
import * as React from 'react';
import Emoji from 'react-emoji-render';

import { IEmojiDto } from '../../../../api/requests/emoji.dto';
import NumberInput from '../../../../components/common/numberInput';
import { isURL } from '../../../../utils/utils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        emoji: {
            fontSize: '32px',
        },
        itemBlock: {
            display: 'flex',
            padding: '5px',
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
        removeButton: {
            padding: '1px',
        },
        numberInput: {
            marginTop: 'auto',
        },
        headerEmojiItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        emojiItemPanel: {
            width: '100%',
            padding: '0px 5px 0px 5px',
            display: 'flex',
            flexDirection: 'column',
        },
    }),
);

interface IEmojiListItemProps {
    onChange: (emoji: IEmojiDto, score: number) => void;
    onDelete: (emoji: IEmojiDto) => void;
    isSelected: boolean;
    emoji: IEmojiDto;
}

const EmojiListItem: React.FunctionComponent<IEmojiListItemProps> = (props: IEmojiListItemProps) => {
    const { isSelected, emoji, onChange } = props;
    const styles = useStyles();
    const isLoading = props.emoji === undefined;

    return (
        <Paper
            className={clsx(styles.itemBlock, {
                [styles.selectedItemBlock]: isSelected,
            })}
        >
            <>
                {isLoading ? (
                    <Skeleton variant="rect" className={styles.avatar} />
                ) : (
                    <Avatar className={styles.avatar}>
                        {isURL(emoji.url) ? (
                            <img width={32} height={32} src={emoji.url} alt="img" />
                        ) : (
                            <Emoji className={styles.emoji} text={emoji.url} />
                        )}
                    </Avatar>
                )}

                <div className={styles.emojiItemPanel}>
                    <div className={styles.headerEmojiItem}>
                        {isLoading ? (
                            <Skeleton height={12} width="30%" />
                        ) : (
                            <>
                                <Typography variant="h4">{emoji.name}</Typography>
                                {props.isSelected && (
                                    <IconButton onClick={e => props.onDelete(emoji)} className={styles.removeButton}>
                                        <Close />
                                    </IconButton>
                                )}
                            </>
                        )}
                    </div>
                    <Divider />
                    {isLoading ? (
                        <Skeleton className={styles.numberInput} />
                    ) : (
                        <NumberInput className={styles.numberInput} value={emoji.scorePoints} onChange={e => onChange(emoji, e)} />
                    )}
                </div>
            </>
        </Paper>
    );
};

export default EmojiListItem;
