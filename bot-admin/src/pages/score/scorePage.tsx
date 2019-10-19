import { Fab, MenuItem, Select, StyleRulesCallback, Table, TableBody, TableCell, TableRow, Theme, WithStyles, withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { SettingsApplications } from '@material-ui/icons';
import clsx from 'clsx';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { ITopItemDto } from '../../api/requests/topItemDto';
import { EWinnerPeriod } from '../../api/requests/winnerPeriod';
import { getWinnersByPeriod, WinnersStorage } from '../../ducks/score';
import { IReduxState } from '../../reduxx/reducer';
import combineStyles from '../../utils/utils';
import fabButtonStyles, { FabButtonStylesKey } from '../../variables/styles';
import WinnerAvatar from './components/winnerAvatar';
import WinnerPanel from './components/winnerPanel';

type ScorePageClassKey = 'scoreTop' | 'select' | 'disabledRow' | 'avatarWithScoreTop' | 'winnerSpace';

const ScorePageStyles: StyleRulesCallback<Theme, {}, ScorePageClassKey> = (theme: Theme) => ({
    avatarWithScoreTop: {
        display: 'flex',
        flexDirection: 'row',
    },
    scoreTop: {
        flex: 1,
        marginTop: 0,
        marginRight: '5px',
        padding: '10px',
    },

    select: {
        marginBottom: '15px',
    },
    disabledRow: {
        opacity: 0.4,
    },
    winnerSpace: {
        display: 'flex',
        flexDirection: 'row',
    },
});

interface IStatedProps {
    winners: WinnersStorage;
}

interface IDispatchedProps {
    getWinnersByPeriod: (period: EWinnerPeriod) => void;
}

interface IState {
    selectedPeriod: EWinnerPeriod;
}

interface IProps extends RouteComponentProps, IStatedProps, IDispatchedProps {}

class ScorePage extends React.Component<IProps & WithStyles<FabButtonStylesKey> & WithStyles<ScorePageClassKey>, IState> {
    constructor (props: IProps & WithStyles<FabButtonStylesKey> & WithStyles<ScorePageClassKey>) {
        super(props);
        this.state = { selectedPeriod: EWinnerPeriod.Week };
    }

    public componentDidMount (): void {
        this.props.getWinnersByPeriod(this.state.selectedPeriod);
    }

    public render (): JSX.Element {
        const { classes } = this.props;
        const firstWinner = this.getFirstWinner();
        return (
            <div>
                <div className={classes.winnerSpace}>
                    <WinnerPanel winner={firstWinner} />
                    <Paper className={classes.scoreTop}>
                        <Select className={classes.select} onChange={e => this.loadWinnersForPeriod(e)} value={this.state.selectedPeriod}>
                            <MenuItem value={EWinnerPeriod.Week}>Неделя</MenuItem>
                            <MenuItem value={EWinnerPeriod.Month}>Месяц</MenuItem>
                            <MenuItem value={EWinnerPeriod.Year}>Год</MenuItem>
                        </Select>
                        <Table>
                            <TableBody>
                                {this.props.winners[this.state.selectedPeriod].map((item, index) => (
                                    <TableRow
                                        className={clsx({
                                            [classes.disabledRow]: index > 5, // only when open === true
                                        })}
                                        key={item.winner.id}
                                    >
                                        <TableCell padding="checkbox">{index + 1}</TableCell>
                                        <TableCell padding="checkbox" align="center">
                                            <WinnerAvatar score={item} className={classes.avatarWithScoreTop} />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {item.winner.realName}
                                        </TableCell>
                                        <TableCell padding="checkbox" align="right">
                                            {item.score}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
                <div style={{ position: 'fixed' }}>
                    <Fab variant="extended" onClick={this.goToSettings} className={classes.fab}>
                        <SettingsApplications />
                        Настройки
                    </Fab>
                </div>
            </div>
        );
    }

    private goToSettings = () => {
        this.props.history.push('/score/settings');
    };

    private loadWinnersForPeriod = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const period = event.target.value as EWinnerPeriod;
        this.setState({ selectedPeriod: period });
        this.props.getWinnersByPeriod(period);
    };

    private getFirstWinner (): ITopItemDto | undefined {
        if (this.props.winners[this.state.selectedPeriod].length > 0) {
            return this.props.winners[this.state.selectedPeriod][0];
        } else {
            return undefined;
        }
    }
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    winners: state.score.get('winners').toJS(),
});

const combinedStyles: any = combineStyles(fabButtonStyles, ScorePageStyles);

export default connect<IStatedProps, IDispatchedProps, any, any>(
    mapStateToProps,
    { getWinnersByPeriod: getWinnersByPeriod.started },
)(withStyles(combinedStyles)(ScorePage));
