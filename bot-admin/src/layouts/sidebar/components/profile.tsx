import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Avatar, createStyles, Theme, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { ReduxState } from "../../../reduxx/reducer";
import { UserDto } from "../../../api/requests/user.dto";
import Skeleton from "@material-ui/lab/Skeleton";
import ProfileAvatar from "../../../components/common/profileAvatar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "fit-content"
    },
    avatar: {
      width: 60,
      height: 60
    },
    name: {
      marginTop: theme.spacing(1)
    }
  })
);

interface Props extends StatedProps {
  className: any;
}
interface StatedProps {
  profile: UserDto;
}

function Profile(props: Props) {
  const { className, profile, ...rest } = props;

  const classes = useStyles();

  if (profile) {
    return (
      <div {...rest} className={clsx(classes.root, className)}>
        <ProfileAvatar profile={profile} className={classes.avatar} />

        <Typography className={classes.name} variant="h4">
          {profile.name}
        </Typography>
        <Typography variant="body2">{profile.teamName}</Typography>
      </div>
    );
  } else {
    return (
      <div {...rest} className={clsx(classes.root, className)}>
        <Skeleton className={classes.avatar} variant="circle" />
        <Skeleton className={classes.name} width="60%" height={20} />
        <Skeleton className={classes.name} width="40%" height={12} />
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  profile: state.auth.getIn(["userProfile", "data"]) as UserDto
});

export default connect(mapStateToProps)(Profile);
