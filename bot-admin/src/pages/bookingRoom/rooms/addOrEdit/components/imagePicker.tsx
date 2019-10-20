import { createStyles, makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { AddPhotoAlternateOutlined, DeleteOutlined } from '@material-ui/icons';
import React, { useState } from 'react';

import PopupDialog from '../../../../../components/dialog';
import ImageManager from '../../../../../components/image/imageManager';

interface IProps {
    value?: string;
    onImagePick: (url: string) => void;
    onDeleteImage: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainPaper: { margin: 2, padding: 5 },
        imageDiv: {
            border: '1px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            maxHeight: '200px',
            position: 'relative',
        },
        img: {
            border: '1px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            maxHeight: '200px',
        },
        deleteButton: {
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#0000005c',
            margin: 5,
            color: 'white',
        },
    }),
);

export default function ImagePicker (props: IProps): JSX.Element {
    const classes = useStyles();
    const [isImageManagerOpen, setImageManagerOpen] = useState(false);

    function openImageDialog (): void {
        setImageManagerOpen(true);
    }

    function closeImageDialog (): void {
        setImageManagerOpen(false);
    }

    function onImagePick (url: string): void {
        setImageManagerOpen(false);
        props.onImagePick(url);
    }

    function onDeleteImage (): void {
        props.onDeleteImage();
    }

    return (
        <div className={classes.imageDiv}>
            {props.value ? (
                <>
                    <img className={classes.img} src={props.value} alt="img" />
                    <IconButton onClick={onDeleteImage} className={classes.deleteButton}>
                        <DeleteOutlined />
                    </IconButton>
                </>
            ) : (
                <IconButton onClick={openImageDialog}>
                    <AddPhotoAlternateOutlined style={{ fontSize: '70px' }} />
                </IconButton>
            )}
            <PopupDialog onClose={closeImageDialog} title="Выбор картинок" isOpen={isImageManagerOpen} saveButtonDisabled={true}>
                <ImageManager onImagePick={onImagePick} />
            </PopupDialog>
        </div>
    );
}
