import * as React from "react";
import { ReduxState } from "../../../../reduxx/reducer";
import { connect } from "react-redux";
import {
  Typography,
  withStyles,
  Theme,
  StyleRulesCallback,
  WithStyles,
  Divider,
  Fab
} from "@material-ui/core";
import fabButtonStyles, {
  FabButtonStylesKey
} from "../../../../variables/styles";
import {
  addEmoji,
  AddEmojiPayload,
  deleteEmoji,
  getEmoji,
  getEmojiSelector,
  updateEmoji,
  UpdateEmojiPayload
} from "../../../../ducks/score";
import { EmojiDto } from "../../../../api/requests/emoji.dto";
import * as Immutable from "immutable";
import EmojiList from "./components/emojiList";
import combineStyles from "../../../../utils/utils";
import {Save } from "@material-ui/icons";
import NewEmojiPicker from "./components/newEmojiPicker";

type ScoreSettingsClassKey =
  | "expansionPanel"
  | "header"
  | "divider"
  | "buttonPanel";

const scoreSettingsPageStyles: StyleRulesCallback<
  Theme,
  {},
  ScoreSettingsClassKey
> = (theme: Theme) => ({
  expansionPanel: { margin: 10 },
  header: { margin: 10 },
  divider: { marginTop: 5, marginBottom: 5 },
  buttonPanel: {
    display: "flex",
    justifyContent: "flex-end"
  }
});

interface DispatchedProps {
  getEmoji: () => void;
  deleteEmoji: (emoji: EmojiDto) => void;
  addEmoji: (newEmoji: AddEmojiPayload) => void;
  updateEmoji: (emoji: UpdateEmojiPayload) => void;
}

interface StatedProps {
  emoji: EmojiDto[];
  emojiFetching: boolean;
}
interface State {
  emoji: Immutable.List<EmojiDto>;
  addDialogOpen: boolean;
}

interface Props extends DispatchedProps, StatedProps {}

class ScoreSettingsPage extends React.Component<
  Props & WithStyles<ScoreSettingsClassKey> & WithStyles<FabButtonStylesKey>,
  State
> {
  constructor(
    props: Props &
      WithStyles<ScoreSettingsClassKey> &
      WithStyles<FabButtonStylesKey>
  ) {
    super(props);
    this.state = { emoji: Immutable.List([]), addDialogOpen: false };
  }
  public componentDidUpdate(
    prevProps: Readonly<
      Props & WithStyles<ScoreSettingsClassKey> & WithStyles<FabButtonStylesKey>
    >,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    if (prevProps.emoji !== this.props.emoji) {
      this.setState({ emoji: Immutable.List(this.props.emoji) });
    }
  }

  public render() {
    const { classes } = this.props;
    const emoji = this.state.emoji
      .toArray()
      .sort((a, b) => (a.scorePoints < b.scorePoints ? 1 : -1));
    return (
      <>
        <div>
          <Typography className={classes.header} variant="h3">
            Настройки медалей
          </Typography>
          <Divider className={classes.divider} />

          <EmojiList
            onDelete={this.props.deleteEmoji}
            isSelected={true}
            onChange={this.onChangeScoreEmoji}
            emoji={emoji}
            isFetching={this.props.emojiFetching}
            onAdd={this.openAddEmojiDialog}
          />
        </div>
        <Divider className={classes.divider} />
        <div style={{ position: "fixed" }}>
          <Fab
            variant="extended"
            className={classes.fab}
            onClick={e => this.props.updateEmoji({ updatedEmoji: emoji })}
          >
            <Save />
            Сохранить
          </Fab>
        </div>
        <NewEmojiPicker
          onClose={this.closeAddEmojiDialog}
          isOpen={this.state.addDialogOpen}
          onEmojiPick={this.onEmojiPickHandler}
        />
      </>
    );
  }

  private onEmojiPickHandler = (emoji: string) => {
    this.closeAddEmojiDialog();
    this.props.addEmoji({
      newEmoji: {
        name: emoji,
        url: `:${emoji}:`,
        scorePoints: 0,
        isCustom: false
      }
    });
  };
  private closeAddEmojiDialog = () => {
    this.setState({ addDialogOpen: false });
  };

  private openAddEmojiDialog = () => {
    this.setState({ addDialogOpen: true });
  };

  private onChangeScoreEmoji = (emoji: EmojiDto) => {
    const index = this.state.emoji.findIndex(x => x.name === emoji.name);
    this.setState({ emoji: this.state.emoji.set(index, emoji) });
  };

  public componentDidMount(): void {
    this.props.getEmoji();
  }
}

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  emoji: getEmojiSelector(state),
  emojiFetching: state.score.getIn(["emoji", "isFetching"])
});

const combinedStyles: any = combineStyles(
  fabButtonStyles,
  scoreSettingsPageStyles
);

export default connect(
  mapStateToProps,
  {
    getEmoji: getEmoji.started,
    deleteEmoji: deleteEmoji.started,
    addEmoji,
    updateEmoji: updateEmoji.started
  }
)(withStyles(combinedStyles)(ScoreSettingsPage));
