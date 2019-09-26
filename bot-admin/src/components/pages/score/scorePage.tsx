import * as React from "react";
import fabButtonStyles, { FabButtonStylesKey } from "../../../variables/styles";
import {
  Avatar,
  Divider,
  Fab,
  MenuItem,
  Select,
  StyleRulesCallback,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Theme,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { SettingsApplications } from "@material-ui/icons";
import { connect } from "react-redux";
import { getWinnersByPeriod, WinnersStorage } from "../../../ducks/score";
import { ReduxState } from "../../../reduxx/reducer";
import TopItemDto from "../../../api/requests/topItemDto";
import combineStyles from "../../../utils/utils";
import Paper from "@material-ui/core/Paper";
import WinnerAvatar from "./components/winnerAvatar";
import clsx from "clsx";
import { WinnerPeriod } from "../../../api/requests/winnerPeriod";
import WinnerPanel from "./components/winnerPanel";

type ScorePageClassKey =
  | "header"
  | "divider"
  | "scoreTop"
  | "select"
  | "disabledRow"
  | "avatarWithScoreTop"
  | "winnerSpace";

const ScorePageStyles: StyleRulesCallback<Theme, {}, ScorePageClassKey> = (
  theme: Theme
) => ({
  header: { margin: 10 },
  divider: { marginTop: 5, marginBottom: 5 },
  avatarWithScoreTop: {
    display: "flex",
    flexDirection: "row"
  },
  scoreTop: {
    flex: 1,
    marginTop: 0,
    marginRight: "5px",
    padding: "10px"
  },

  select: {
    marginBottom: "15px"
  },
  disabledRow: {
    opacity: 0.4
  },
  winnerSpace: {
    display: "flex",
    flexDirection: "row"
  }
});

interface StatedProps {
  winners: WinnersStorage;
}

interface DispatchedProps {
  getWinnersByPeriod: (period: WinnerPeriod) => void;
}

interface State {
  selectedPeriod: WinnerPeriod;
}

interface Props extends RouteComponentProps, StatedProps, DispatchedProps {}

class ScorePage extends React.Component<
  Props & WithStyles<FabButtonStylesKey> & WithStyles<ScorePageClassKey>,
  State
> {
  constructor(
    props: Props &
      WithStyles<FabButtonStylesKey> &
      WithStyles<ScorePageClassKey>
  ) {
    super(props);
    this.state = { selectedPeriod: WinnerPeriod.Week };
  }

  public componentDidMount(): void {
    this.props.getWinnersByPeriod(this.state.selectedPeriod);
  }

  public render() {
    const { classes } = this.props;
    const firstWinner = this.getFirstWinner();
    return (
      <div>
        <Typography className={classes.header} variant="h3">
          Счёт
        </Typography>
        <Divider className={classes.divider} />
        <div className={classes.winnerSpace}>
          <WinnerPanel winner={firstWinner} />
          <Paper className={classes.scoreTop}>
            <Select
              className={classes.select}
              onChange={e => this.loadWinnersForPeriod(e)}
              value={this.state.selectedPeriod}
            >
              <MenuItem value={WinnerPeriod.Week}>Неделя</MenuItem>
              <MenuItem value={WinnerPeriod.Month}>Месяц</MenuItem>
              <MenuItem value={WinnerPeriod.Year}>Год</MenuItem>
            </Select>
            <Table>
              <TableBody>
                {this.props.winners[this.state.selectedPeriod].map(
                  (item, index) => (
                    <TableRow
                      className={clsx({
                        [classes.disabledRow]: index > 5 //only when open === true
                      })}
                      key={item.winner.id}
                    >
                      <TableCell padding="checkbox">{index + 1}</TableCell>
                      <TableCell padding="checkbox" align="center">
                        <WinnerAvatar
                          score={item}
                          className={classes.avatarWithScoreTop}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {item.winner.realName}
                      </TableCell>
                      <TableCell padding="checkbox" align="right">
                        {item.score}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Paper>
        </div>
        <div style={{ position: "fixed" }}>
          <Fab
            variant="extended"
            onClick={this.goToSettings}
            className={classes.fab}
          >
            <SettingsApplications />
            Настройки
          </Fab>
        </div>
      </div>
    );
  }

  private goToSettings = () => {
    this.props.history.push(`/score/settings`);
  };

  private loadWinnersForPeriod = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const period = event.target.value as WinnerPeriod;
    this.setState({ selectedPeriod: period });
    this.props.getWinnersByPeriod(period);
  };

  private getFirstWinner(): TopItemDto|undefined
  {
    if (this.props.winners[this.state.selectedPeriod].length > 0) {
      return this.props.winners[this.state.selectedPeriod][0];
    } else {
      return undefined;
    }
  }
}

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  winners: state.score.get("winners").toJS()
});

const combinedStyles: any = combineStyles(fabButtonStyles, ScorePageStyles);

export default connect<StatedProps, DispatchedProps, any, any>(
  mapStateToProps,
  { getWinnersByPeriod: getWinnersByPeriod.started }
)(withStyles(combinedStyles)(ScorePage));
