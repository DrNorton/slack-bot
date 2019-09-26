import * as React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  IconButton,
  List,
  makeStyles,
  Theme
} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { grey } from "@material-ui/core/colors";
import { FaqDto } from "../../../api/requests/faq.dto";
import Skeleton from "@material-ui/lab/Skeleton";
import ReactMarkdown from "react-markdown";
import {ArrowRight, DeleteOutlined} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

    },
    paper: {
      width: "100%",
      marginBottom: 10
    },
    orangeAvatar: {
      margin: 10,
      color: "#fff",
      backgroundColor: theme.palette.secondary.main
    },
    greyAvatar: {
      margin: 10,
      color: "#fff",
      backgroundColor: grey[500]
    },
    skeletonAvatar: {
      margin: 10
    },
    divider: {
      marginTop: 10,
      marginBottom: 10
    },
    markdown: {
      width: "100%",
      padding: 10
    },
    actions: {
      justifyContent: "flex-end"
    }
  })
);

type FaqItemProps = {
  faqItem: FaqDto;
  onSelect: (id?: number) => void;
  onDelete: (faqItem: FaqDto) => void;
};

type FaqListProps = {
  faqItems: FaqDto[];
  isFetching: boolean;
  onSelect: (id?: number) => void;
  onDelete: (faqItem: FaqDto) => void;
};

const FaqItemComponent: React.FunctionComponent<FaqItemProps> = props => {
  const styles = useStyles();
  const { faqItem, onSelect } = props;
  return (
    <div className={styles.paper}>
      {faqItem ? (
        <ListItem >
          <Card style={{ width: "100%" }}>
            <CardHeader
              title={
                <ReactMarkdown
                  className={styles.markdown}
                  source={faqItem.question}
                  escapeHtml={false}
                />
              }
              action={
                  <IconButton
                      onClick={e => props.onDelete(faqItem)}
                      edge="end"
                      aria-label="delete"
                      style={{marginRight
                              :5}}
                  >
                      <DeleteOutlined />
                  </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <ReactMarkdown
                className={styles.markdown}
                source={faqItem.answer}
                escapeHtml={false}
              />
            </CardContent>
            <Divider />
            <CardActions className={styles.actions}>
              <Button onClick={e => onSelect(faqItem.id)} color="primary" size="small" variant="text">
                Редактировать <ArrowRight />
              </Button>
            </CardActions>
          </Card>
        </ListItem>
      ) : (
        <ListItem>
          <ListItemText
            primary={<Skeleton height={6} width="30%" />}
            secondary={
              <>
                <Skeleton height={6} width="100%" />
                <Skeleton height={6} width="100%" />
                <Skeleton height={6} width="20%" />
              </>
            }
          />
            <Card style={{ width: "100%" }}>
                <CardHeader
                    title={
                        <Skeleton height={6} width="30%" />
                    }
                />
                <Divider />
                <CardContent>
                    <>
                        <Skeleton height={6} width="100%" />
                        <Skeleton height={6} width="100%" />
                        <Skeleton height={6} width="20%" />
                    </>
                </CardContent>
                <Divider />
                <CardActions className={styles.actions}>
                    <Skeleton height={6} width="20%" />
                </CardActions>
            </Card>
        </ListItem>
      )}
    </div>
  );
};

const FaqItemList: React.FunctionComponent<FaqListProps> = faqListProps => {
  const styles = useStyles();
  const { faqItems, onSelect, isFetching, onDelete } = faqListProps;
  const items = isFetching ? Array.from(new Array(6)) : faqItems;
  return (
    <List className={styles.root}>
      {items.map((item, index) => (
        <FaqItemComponent
          key={item ? item.id : index}
          faqItem={item}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
};
export default FaqItemList;
