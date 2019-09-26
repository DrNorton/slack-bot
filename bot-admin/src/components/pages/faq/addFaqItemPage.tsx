import { RouteComponentProps } from "react-router";
import * as React from "react";
import {
  Box,
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Form, Field } from "react-final-form";
import { ReduxState } from "../../../reduxx/reducer";
import { connect } from "react-redux";
import {
  createOrUpdateFaqItem,
  CreateOrUpdateFaqPayload,
  getFaqItemById
} from "../../../ducks/faq";
import TitlePageWrapper from "../../titlePageWrapper";
import { FaqDto } from "../../../api/requests/faq.dto";
import MarkdownInputAdapter from "../../markdownInput";
import Skeleton from "@material-ui/lab/Skeleton";

export interface State {
  newOrEditFaqItem?: FaqDto;
  faqItemId?: number;
  title: string;
  isImagePickerOpen: boolean;
  buttonTitle: string;
}

interface DispatchedProps {
  getFaqItemById: (eventId: number) => void;
  createOrUpdateFaqItem: (payload: CreateOrUpdateFaqPayload) => void;
}

interface StatedProps {
  faqItem: FaqDto;
  getFaqItemFetching: boolean;
  isError: boolean;
}

interface Props extends DispatchedProps, StatedProps, RouteComponentProps {}

class AddFaqItemPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const params = props.match.params;
    const faqItemId = (params as any).faqItemId;
    if (faqItemId) {
      // редактирование
      this.state = {
        faqItemId: parseInt(faqItemId),
        title: "Редактирование",
        buttonTitle: "Обновить",
        isImagePickerOpen: false
      };
    } else {
      this.state = {
        newOrEditFaqItem: {
          question: "",
          answer: "",
          id: 0
        },
        title: "Новое событие",
        buttonTitle: "Создать",
        isImagePickerOpen: false
      };
    }
  }

  public componentDidMount(): void {
    if (!this.state.newOrEditFaqItem && this.state.faqItemId) {
      this.props.getFaqItemById(this.state.faqItemId);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (!this.state.newOrEditFaqItem && this.state.faqItemId) {
      if (prevProps.faqItem !== this.props.faqItem) {
        this.setState({
          newOrEditFaqItem: this.props.faqItem
        });
      }
    }
  }

  public render() {
    return (
      <Paper style={{padding:10}}>
        <Grid spacing={5} container={true}>
          <Grid item={true} xs={6}>
            <MarkdownEditorWithLoading
              initialValue={this.state.newOrEditFaqItem}
              onChangeValue={this.onChangeQuestion}
              label="Вопрос"
              isAnswer={false}
              isLoading={this.props.getFaqItemFetching}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <MarkdownEditorWithLoading
              initialValue={this.state.newOrEditFaqItem}
              onChangeValue={this.onChangeAnswer}
              label="Ответ"
              isAnswer={true}
              isLoading={this.props.getFaqItemFetching}
            />
          </Grid>
        </Grid>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <Button
            onClick={e => this.goBack()}
            style={{ margin: "10px" }}
            variant="outlined"
            disabled={this.props.getFaqItemFetching}
            type="button"
            color="primary"
          >
            Отменить
          </Button>
          <Button
            style={{ margin: "10px" }}
            onClick={e => this.onSubmit()}
            type="submit"
            variant="contained"
            disabled={this.props.getFaqItemFetching}
            color="primary"
          >
            {this.state.buttonTitle}
          </Button>
        </div>
      </Paper>
    );
  }

  private onChangeAnswer = (text: string) => {
    const item = this.state.newOrEditFaqItem;
    if (item) {
      item.answer = text;
      this.setState({ newOrEditFaqItem: item });
    }
  };

  private onChangeQuestion = (text: string) => {
    const item = this.state.newOrEditFaqItem;
    if (item) {
      item.question = text;
      this.setState({ newOrEditFaqItem: item });
    }
  };

  private goBack = () => {
    this.props.history.goBack();
  };

  private onSubmit = () => {
    const isUpdate = this.state.faqItemId !== undefined;
    if (this.state.newOrEditFaqItem) {
      this.props.createOrUpdateFaqItem({
        faqItem: this.state.newOrEditFaqItem,
        isUpdate
      });
    }
  };
}

const MarkdownEditorWithLoading: React.FunctionComponent<{
  initialValue?: FaqDto;
  onChangeValue: (text: string) => void;
  label: string;
  isAnswer: boolean;
  isLoading: boolean;
}> = props => {
  if (props.isLoading) {
    return (
      <Box>
        <Skeleton height={30} width="100%" />
        <Skeleton height={300} width="100%" />
      </Box>
    );
  } else {
    if (props.initialValue) {
      let init;
      if (props.isAnswer) {
        init = props.initialValue.answer;
      } else {
        init = props.initialValue.question;
      }
      return (
        <MarkdownInputAdapter
          initialValue={init}
          onChangeValue={props.onChangeValue}
          label={props.label}
        />
      );
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  faqItem: state.faq.getIn(["editedFaqItem", "data"]) as FaqDto,
  getFaqItemFetching: state.faq.getIn([
    "editedFaqItem",
    "isFetching"
  ]) as boolean,
  isError: state.faq.getIn(["editedFaqItem", "isError"]) as boolean
});

export default connect(
  mapStateToProps,
  {
    getFaqItemById: getFaqItemById.started,
    createOrUpdateFaqItem: createOrUpdateFaqItem.started
  }
)(AddFaqItemPage);
