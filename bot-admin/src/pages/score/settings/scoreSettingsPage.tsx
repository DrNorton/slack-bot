import { Divider, Fab, StyleRulesCallback, Theme, withStyles, WithStyles } from '@material-ui/core';
import { Save } from '@material-ui/icons';
import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';

import { IEmojiDto } from '../../../api/requests/emoji.dto';
import { addEmoji, deleteEmoji, getEmoji, getEmojiSelector, IAddEmojiPayload, IUpdateEmojiPayload, updateEmoji } from '../../../ducks/score';
import { IReduxState } from '../../../reduxx/reducer';
import combineStyles from '../../../utils/utils';
import fabButtonStyles, { FabButtonStylesKey } from '../../../variables/styles';
import EmojiList from './components/emojiList';
import NewEmojiPicker from './components/newEmojiPicker';

type ScoreSettingsClassKey = 'expansionPanel' | 'divider' | 'buttonPanel';

const scoreSettingsPageStyles: StyleRulesCallback<Theme, {}, ScoreSettingsClassKey> = (theme: Theme) => ({
    expansionPanel: { margin: 10 },
    divider: { marginTop: 5, marginBottom: 5 },
    buttonPanel: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

interface IDispatchedProps {
    getEmoji: () => void;
    deleteEmoji: (emoji: IEmojiDto) => void;
    addEmoji: (newEmoji: IAddEmojiPayload) => void;
    updateEmoji: (emoji: IUpdateEmojiPayload) => void;
}

interface IStatedProps {
    emoji: IEmojiDto[];
    emojiFetching: boolean;
}

interface IState {
    emoji: Immutable.List<IEmojiDto>;
    addDialogOpen: boolean;
}

interface IProps extends IDispatchedProps, IStatedProps {}

class ScoreSettingsPage extends React.Component<IProps & WithStyles<ScoreSettingsClassKey> & WithStyles<FabButtonStylesKey>, IState> {
    constructor (props: IProps & WithStyles<ScoreSettingsClassKey> & WithStyles<FabButtonStylesKey>) {
        super(props);
        this.state = { emoji: Immutable.List([]), addDialogOpen: false };
    }

    public componentDidUpdate (
        prevProps: Readonly<IProps & WithStyles<ScoreSettingsClassKey> & WithStyles<FabButtonStylesKey>>,
        prevState: Readonly<{}>,
        snapshot?: any,
    ): void {
        if (prevProps.emoji !== this.props.emoji) {
            this.setState({ emoji: Immutable.List(this.props.emoji) });
        }
    }

    public render (): JSX.Element {
        const { classes } = this.props;
        const emoji = this.state.emoji.toArray().sort((a, b) => (a.scorePoints < b.scorePoints ? 1 : -1));
        return (
            <>
                <EmojiList
                    onDelete={this.props.deleteEmoji}
                    isSelected={true}
                    onChange={this.onChangeScoreEmoji}
                    emoji={emoji}
                    isFetching={this.props.emojiFetching}
                    onAdd={this.openAddEmojiDialog}
                />

                <Divider className={classes.divider} />
                <div style={{ position: 'fixed' }}>
                    <Fab variant="extended" className={classes.fab} onClick={e => this.props.updateEmoji({ updatedEmoji: emoji })}>
                        <Save />
                        Сохранить
                    </Fab>
                </div>
                <NewEmojiPicker onClose={this.closeAddEmojiDialog} isOpen={this.state.addDialogOpen} onEmojiPick={this.onEmojiPickHandler} />
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
                isCustom: false,
            },
        });
    };
    private closeAddEmojiDialog = () => {
        this.setState({ addDialogOpen: false });
    };

    private openAddEmojiDialog = () => {
        this.setState({ addDialogOpen: true });
    };

    private onChangeScoreEmoji = (emoji: IEmojiDto) => {
        const index = this.state.emoji.findIndex(x => x.name === emoji.name);
        this.setState({ emoji: this.state.emoji.set(index, emoji) });
    };

    public componentDidMount (): void {
        this.props.getEmoji();
    }
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    emoji: getEmojiSelector(state),
    emojiFetching: state.score.getIn(['emoji', 'isFetching']),
});

const combinedStyles: any = combineStyles(fabButtonStyles, scoreSettingsPageStyles);

export default connect(
    mapStateToProps,
    {
        getEmoji: getEmoji.started,
        deleteEmoji: deleteEmoji.started,
        addEmoji,
        updateEmoji: updateEmoji.started,
    },
)(withStyles(combinedStyles)(ScoreSettingsPage));
