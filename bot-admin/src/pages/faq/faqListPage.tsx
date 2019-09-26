import * as React from "react";
import { ReduxState } from "../../reduxx/reducer";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Fab, WithStyles, withStyles } from "@material-ui/core";
import fabButtonStyles, { FabButtonStylesKey } from "../../variables/styles";
import AddIcon from "@material-ui/icons/Add";
import FaqItemList from "./components/faqItemList";
import { FaqDto } from "../../api/requests/faq.dto";
import { deleteFaqItem, getFaqItems } from "../../ducks/faq";

export interface State {}

interface DispatchedProps {
  getFaqItems: () => void;
  deleteFaqItem: (event: FaqDto) => void;
}

interface StatedProps {
  faqItems: FaqDto[];
  isFetching: boolean;
  isError: boolean;
}

interface Props extends DispatchedProps, StatedProps, RouteComponentProps {}

class FaqListPage extends React.Component<
  Props & WithStyles<FabButtonStylesKey>,
  State
> {
  constructor(props: Props & WithStyles<FabButtonStylesKey>) {
    super(props);
  }
  public componentDidMount(): void {
    this.props.getFaqItems();
  }

  public render() {
    const { classes } = this.props;
    return (
      <>
          <FaqItemList
            isFetching={this.props.isFetching}
            onDelete={this.deleteFaqItem}
            onSelect={this.onItemSelect}
            faqItems={this.props.faqItems}
          />

          <div style={{ position: "fixed" }}>
            <Fab
              variant="extended"
              onClick={this.createNewFaqItem}
              className={classes.fab}
            >
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
    this.props.history.push(`/faq/add`);
  };

  private deleteFaqItem=(faqItem:FaqDto)=>{
    this.props.deleteFaqItem(faqItem);
  }
}

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  faqItems: state.faq.getIn(["faqItems", "data"]) as FaqDto[],
  isFetching: state.faq.getIn(["faqItems", "isFetching"]) as boolean,
  isError: state.faq.getIn(["faqItems", "isError"]) as boolean
});

export default connect(
  mapStateToProps,
  { getFaqItems: getFaqItems.started, deleteFaqItem: deleteFaqItem.started }
)(withStyles(fabButtonStyles)(FaqListPage));
