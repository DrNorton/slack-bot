import React from "react";
import {
  Theme,
  StyleRulesCallback,
  WithStyles,
  withStyles
} from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import ImageDto from "../../../../api/requests/image.dto";
import Skeleton from "@material-ui/lab/Skeleton";
import { Delete } from "@material-ui/icons";

type TitleGridListClassKey =
  | "root"
  | "gridList"
  | "icon"
  | "gridListItemSelect"
  | "titleBar";

const titleGridStyles: StyleRulesCallback<Theme, {}, TitleGridListClassKey> = (
  theme: Theme
) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: { width: "100%", height: "100%" },
  gridListItemSelect: {
    boxSizing: "border-box",
    borderColor: theme.palette.primary.main,
    borderWidth: "5px",
    borderStyle: "solid"
  },
  icon: {
    color: "rgba(255, 255, 255)"
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  }
});

interface Props {
  images: ImageDto[];
  isFetching: boolean;
  onSelectImage:(item:ImageDto)=>void;
  onDeleteImage:(item:ImageDto)=>void;
}

interface State {
  selectedItem?: ImageDto;
}

class TitlebarGridList extends React.Component<
  Props & WithStyles<TitleGridListClassKey>,
  State
> {
  constructor(props: Props & WithStyles<TitleGridListClassKey>) {
    super(props);
    this.state = {};
  }
  public render() {
    const { classes } = this.props;
    const items = this.props.isFetching
      ? Array.from(
          new Array(
            this.props.images.length === 0 ? 10 : this.props.images.length + 1
          )
        )
      : this.props.images;

    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={3}>
          {items.map((tile, index) =>
            tile ? (
              <GridListTile
                classes={{
                  tile:
                    this.state.selectedItem === tile
                      ? classes.gridListItemSelect
                      : undefined
                }}
                onClick={e => this.setSelectedItem(tile)}
                key={tile.url}
              >
                <img src={tile.url} alt={tile.name} />

                <GridListTileBar
                  title={tile.name}
                  className={classes.titleBar}
                  subtitle={<span>{tile.url}</span>}
                  actionIcon={
                    <IconButton onClick={e=>this.props.onDeleteImage(tile)} className={classes.icon}>
                      <Delete />
                    </IconButton>
                  }
                />
              </GridListTile>
            ) : (
              <GridListTile key={index}>
                <Skeleton variant="rect" width="100%" height="100%" />
              </GridListTile>
            )
          )}
        </GridList>
      </div>
    );
  }

  private setSelectedItem = (tile: ImageDto) => {
    this.setState({ selectedItem: tile });
    this.props.onSelectImage(tile);
  };
}

export default withStyles(titleGridStyles)(TitlebarGridList);
