import { CircularProgress, IconButton, Typography } from '@material-ui/core';
import FileCopy from '@material-ui/icons/FileCopy';
import React, { useCallback, useMemo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';

import { IImageDto } from '../../../../api/requests/image.dto';
import { deleteImage, getImages, uploadImage } from '../../../../ducks/image';
import { IReduxState } from '../../../../reduxx/reducer';
import TitlebarGridList from './titlebarGridList';

interface IStatedProps {
    images: IImageDto[];
    isFetching: boolean;
}

interface IDispatchedProps {
    getImages: () => void;
    uploadImage: (file: File) => void;
    deleteImage: (image: IImageDto) => void;
}

interface IProps extends IStatedProps, IDispatchedProps {}

interface IState {
    selectedImage?: IImageDto;
}

class ImageManager extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount (): void {
        this.props.getImages();
    }

    public render (): JSX.Element {
        return (
            <div>
                <TitlebarGridList
                    isFetching={this.props.isFetching}
                    images={this.props.images}
                    onSelectImage={this.onSelectItem}
                    onDeleteImage={this.onDeleteImage}
                />

                {this.state.selectedImage && (
                    <div
                        style={{
                            padding: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'rgb(238, 238, 238)',
                            margin: '10px 2px',
                        }}
                    >
                        <Typography variant={'body1'}>{this.state.selectedImage.url}</Typography>
                        <CopyToClipboard text={this.state.selectedImage.url}>
                            <IconButton>
                                <FileCopy />
                            </IconButton>
                        </CopyToClipboard>
                    </div>
                )}

                <Dropzone isFetching={this.props.isFetching} uploadImage={this.props.uploadImage} />
            </div>
        );
    }

    private onSelectItem = (selectedImage: IImageDto) => {
        this.setState({ selectedImage });
    };

    private onDeleteImage = (image: IImageDto) => {
        this.props.deleteImage(image);
    };
}

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    margin: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
};

const activeStyle = {
    borderColor: '#2196f3',
};

const acceptStyle = {
    borderColor: '#00e676',
};

const rejectStyle = {
    borderColor: '#ff1744',
};

interface IDropzoneProps {
    uploadImage: (file: File) => void;
    isFetching: boolean;
}

function Dropzone (props: IDropzoneProps): JSX.Element {
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles) {
            const file = acceptedFiles.find(x => x !== undefined);
            if (file) {
                props.uploadImage(file);
            }
        }
    }, []);
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ accept: 'image/*', onDrop });

    const style: any = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragReject],
    );

    return (
        <div className="container">
            <div {...getRootProps({ style })}>
                {props.isFetching ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress />
                        <Typography style={{ marginLeft: 5 }} variant="body1">
                            Подождите ...
                        </Typography>
                    </div>
                ) : (
                    <>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop картинки, или нажми чтобы выбрать</p>
                    </>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = (state: IReduxState): IStatedProps => ({
    images: state.image.get('images').toJS(),
    isFetching: state.image.get('isFetching'),
});

export default connect<IStatedProps, IDispatchedProps, void, IReduxState>(
    mapStateToProps,
    {
        getImages: getImages.started,
        uploadImage: uploadImage.started,
        deleteImage: deleteImage.started,
    },
)(ImageManager);
