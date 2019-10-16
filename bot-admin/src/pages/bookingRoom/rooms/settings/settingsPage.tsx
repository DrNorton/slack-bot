import * as React from "react";
import TitleContainerPage from "../../../../components/common/titleContainerPage";
import { Button, colors } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Tab from "@material-ui/core/Tab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import AttributeTypeTab from "./tabs/attributeTypeTab";
import { Redirect } from "react-router-dom";
import IntregationTab from "./tabs/integrationTab";

interface RouteParams {
  tab: string;
}

interface Props extends RouteComponentProps<RouteParams> {}

const useStyles = makeStyles(theme => ({
  root: {},
  inner: {
    width: theme.breakpoints.values.lg,
    maxWidth: "100%",
    margin: "0 auto",
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

const tabs = [
  { value: "attributeTypes", label: "Типы атрибутов" },
  { value: "integration", label: "Интеграции" }
];

function SettingsPage(props: Props) {
  const classes = useStyles();
  const { match, history } = props;
  const { tab } = match.params;

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  if (!tab) {
    return <Redirect to={`${props.location.pathname}/attributeTypes`} />;
  }

  if (!tabs.find(t => t.value === tab)) {
    return <Redirect to="/errors/error-404" />;
  }
  return (
    <TitleContainerPage
      buttons={
        <Button
          key="submit"
          style={{ margin: 5 }}
          variant="contained"
          color="primary"
        >
          Сохранить
        </Button>
      }
      title="Настройки"
      subtitle="Бронирование"
    >
      <Tabs
        onChange={handleTabsChange}
        scrollButtons="auto"
        variant="scrollable"
        value={tab}
      >
        {tabs.map(tab => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Divider className={classes.divider} />
      <div className={classes.content}>
        {tab === "attributeTypes" && <AttributeTypeTab onAdd={() => {}} />}
        {tab === "integration" && <IntregationTab />}
      </div>
    </TitleContainerPage>
  );
}


export default withRouter(SettingsPage);

