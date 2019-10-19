import { Fab, WithStyles, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { IFaqDto } from '../../api/requests/faq.dto';
import { deleteFaqItem, getFaqItems } from '../../ducks/faq';
import { IReduxState } from '../../reduxx/reducer';
import fabButtonStyles, { FabButtonStylesKey } from '../../variables/styles';
import FaqItemList from './components/faqItemList';

export interface IState {}

interface IDispatchedProps {
    getFaqItems: () => void;
    deleteFaqItem: (event: IFaqDto) => void;
}

interface IStatedProps {
    faqItems: IFaqDto[];
    isFetching: boolean;
    isError: boolean;
}

interface IProps extends IDispatchedProps, IStatedProps, RouteComponentProps {}

class FaqListPage extends React.Component<IProps & WithStyles<FabButtonStylesKey>, IState> {
    public componentDidMount (): void {
        this.props.getFaqItems();
    }

    public render (): JSX.Element {
        const { classes } = this.props;
        return (
            <>
                <FaqItemList
                    isFetching={this.props.isFetching}
                    onDelete={this.deleteFaqItem}
                    onSelect={this.onItemSelect}
                    faqItems={this.props.faqItems}
                />

                <div style={{ position: 'fixed' }}>
                    <Fab variant="extended" onClick={this.createNewFaqItem} className={classes.fab}>
                        <AddIcon />
                        Добавить
                    </Fab>
                </div>
            </>
        );
    }

    private onItemSelect = (eventId?: number) => {
        this.props.history.push(`/faq/edit/${eventId}`);
    };

    private createNewFaqItem = () => {
        this.props.history.push('/faq/add');
    };

    private deleteFaqItem = (faqItem: IFaqDto) => {
        this.props.deleteFaqItem(faqItem);
    };
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    faqItems: state.faq.getIn(['faqItems', 'data']) as IFaqDto[],
    isFetching: state.faq.getIn(['faqItems', 'isFetching']) as boolean,
    isError: state.faq.getIn(['faqItems', 'isError']) as boolean,
});

export default connect(
    mapStateToProps,
    { getFaqItems: getFaqItems.started, deleteFaqItem: deleteFaqItem.started },
)(withStyles(fabButtonStyles)(FaqListPage));
