import { Box, Button, Grid, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { IFaqDto } from '../../api/requests/faq.dto';
import MarkdownInputAdapter from '../../components/markdownInput';
import { createOrUpdateFaqItem, getFaqItemById, ICreateOrUpdateFaqPayload } from '../../ducks/faq';
import { IReduxState } from '../../reduxx/reducer';

const MarkdownEditorWithLoading: React.FunctionComponent<{
    initialValue?: IFaqDto;
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
            return <MarkdownInputAdapter initialValue={init} onChangeValue={props.onChangeValue} label={props.label} />;
        } else {
            return <></>;
        }
    }
};

export interface IState {
    newOrEditFaqItem?: IFaqDto;
    faqItemId?: number;
    title: string;
    isImagePickerOpen: boolean;
    buttonTitle: string;
}

interface IDispatchedProps {
    getFaqItemById: (eventId: number) => void;
    createOrUpdateFaqItem: (payload: ICreateOrUpdateFaqPayload) => void;
}

interface IStatedProps {
    faqItem: IFaqDto;
    getFaqItemFetching: boolean;
    isError: boolean;
}

interface IProps extends IDispatchedProps, IStatedProps, RouteComponentProps {}

class AddFaqItemPage extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        const params = props.match.params;
        const faqItemId = (params as any).faqItemId;
        if (faqItemId) {
            // редактирование
            this.state = {
                faqItemId: parseInt(faqItemId, 10),
                title: 'Редактирование',
                buttonTitle: 'Обновить',
                isImagePickerOpen: false,
            };
        } else {
            this.state = {
                newOrEditFaqItem: {
                    question: '',
                    answer: '',
                    id: 0,
                },
                title: 'Новое событие',
                buttonTitle: 'Создать',
                isImagePickerOpen: false,
            };
        }
    }

    public componentDidMount (): void {
        if (!this.state.newOrEditFaqItem && this.state.faqItemId) {
            this.props.getFaqItemById(this.state.faqItemId);
        }
    }

    public componentDidUpdate (prevProps: IProps): void {
        if (!this.state.newOrEditFaqItem && this.state.faqItemId) {
            if (prevProps.faqItem !== this.props.faqItem) {
                this.setState({
                    newOrEditFaqItem: this.props.faqItem,
                });
            }
        }
    }

    public render (): JSX.Element {
        return (
            <Paper style={{ padding: 10 }}>
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
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        onClick={() => this.goBack()}
                        style={{ margin: '10px' }}
                        variant="outlined"
                        disabled={this.props.getFaqItemFetching}
                        type="button"
                        color="primary"
                    >
                        Отменить
                    </Button>
                    <Button
                        style={{ margin: '10px' }}
                        onClick={() => this.onSubmit()}
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
                isUpdate,
            });
        }
    };
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    faqItem: state.faq.getIn(['editedFaqItem', 'data']) as IFaqDto,
    getFaqItemFetching: state.faq.getIn(['editedFaqItem', 'isFetching']) as boolean,
    isError: state.faq.getIn(['editedFaqItem', 'isError']) as boolean,
});

export default connect(
    mapStateToProps,
    {
        getFaqItemById: getFaqItemById.started,
        createOrUpdateFaqItem: createOrUpdateFaqItem.started,
    },
)(AddFaqItemPage);
