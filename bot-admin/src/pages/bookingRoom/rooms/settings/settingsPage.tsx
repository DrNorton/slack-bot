import { Button, colors } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

import TitleContainerPage from '../../../../components/common/titleContainerPage';
import AttributeTypeTab from './tabs/attributeTypeTab';
import IntregationTab from './tabs/integrationTab';

interface IRouteParams {
    tab: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {}

const useStyles = makeStyles(theme => ({
    root: {},
    inner: {
        width: theme.breakpoints.values.lg,
        maxWidth: '100%',
        margin: '0 auto',
        padding: theme.spacing(3),
    },
    divider: {
        backgroundColor: colors.grey[300],
    },
    content: {
        marginTop: theme.spacing(3),
    },
}));

const tabs = [{ value: 'attributeTypes', label: 'Типы атрибутов' }, { value: 'integration', label: 'Интеграции' }];

function SettingsPage (props: IProps): JSX.Element {
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
                <Button key="submit" style={{ margin: 5 }} variant="contained" color="primary">
                    Сохранить
                </Button>}
            title="Настройки"
            subtitle="Бронирование"
        >
            <Tabs onChange={handleTabsChange} scrollButtons="auto" variant="scrollable" value={tab}>
                {tabs.map(item => (
                    <Tab key={item.value} label={item.label} value={item.value} />
                ))}
            </Tabs>
            <Divider className={classes.divider} />
            <div className={classes.content}>
                {tab === 'attributeTypes' && <AttributeTypeTab onAdd={() => console.log('add tab')} />}
                {tab === 'integration' && <IntregationTab />}
            </div>
        </TitleContainerPage>
    );
}

export default withRouter(SettingsPage);
