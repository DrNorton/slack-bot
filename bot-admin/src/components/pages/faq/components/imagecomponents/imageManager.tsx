import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { ReduxState } from "../../../../../reduxx/reducer";
import { connect } from "react-redux";
import {
  deleteImage,
  getImages,
  uploadImage
} from "../../../../../ducks/image";
import ImageDto from "../../../../../api/requests/image.dto";
import TitlebarGridList from "./titlebarGridList";
import { CircularProgress, IconButton, Typography } from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface StatedProps {
  images: ImageDto[];
  isFetching: boolean;
}

interface DispatchedProps {
  getImages: () => void;
  uploadImage: (file: File) => void;
  deleteImage: (image: ImageDto) => void;
}

interface Props extends StatedProps, DispatchedProps {}
interface State {
  selectedImage?: ImageDto;
}
class ImageManager extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public componentDidMount(): void {
    this.props.getImages();
  }

  public render() {
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgb(238, 238, 238)",
              margin: "10px 2px"
            }}
          >
            <Typography variant={"body1"}>
              {this.state.selectedImage.url}
            </Typography>
            <CopyToClipboard text={this.state.selectedImage.url}>
              <IconButton>
                <FileCopy />
              </IconButton>
            </CopyToClipboard>
          </div>
        )}

        <Dropzone
          isFetching={this.props.isFetching}
          uploadImage={this.props.uploadImage}
        />
      </div>
    );
  }

  private onSelectItem = (selectedImage: ImageDto) => {
    this.setState({ selectedImage });
  };

  private onDeleteImage = (image: ImageDto) => {
    this.props.deleteImage(image);
  };
}

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  margin: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out"
};

const activeStyle = {
  borderColor: "#2196f3"
};

const acceptStyle = {
  borderColor: "#00e676"
};

const rejectStyle = {
  borderColor: "#ff1744"
};

interface DropzoneProps {
  uploadImage: (file: File) => void;
  isFetching: boolean;
}
function Dropzone(props: DropzoneProps) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles) {
      const file = acceptedFiles.find(x => x !== undefined);
      if (file) {
        props.uploadImage(file);
      }
    }
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: "image/*", onDrop });

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        {props.isFetching ? (
          <div style={{ display: "flex", alignItems: "center" }}>
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

const mapStateToProps = (state: ReduxState): StatedProps => ({
  images: state.image.get("images").toJS(),
  isFetching: state.image.get("isFetching")
});

export default connect<StatedProps, DispatchedProps, void, ReduxState>(
  mapStateToProps,
  {
    getImages: getImages.started,
    uploadImage: uploadImage.started,
    deleteImage: deleteImage.started
  }
)(ImageManager);
