import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Avatar, IconButton, ListItemText, ListItem, ListItemAvatar, Typography, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({ // לעיצוב במטריאל-יו-איי
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        border: "1px solid black",
        btn: {
            "&:focus": {
                outline: "none"
            },
        },
    },
    inlineComments: {
        display: 'inline',
    },
}));

const Comment = (props) => {
    const classes = useStyles();

    const renderedComment = () => {
        let imgSrc, displayName;
        let user = props.users.find((u) => u.email.toUpperCase() === props.comment.user.email.toUpperCase());
        if (user === undefined) {
            imgSrc = "https://static.thenounproject.com/png/574748-200.png";
            displayName = "user not exist";
        }
        else {
            imgSrc = user.img;
            displayName = user.displayName;
        };
        return (
            <React.Fragment>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={imgSrc} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={props.comment.title}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inlineComments}
                                    color="textPrimary"
                                >
                                    {displayName}
                                </Typography>
                                {` — ${props.comment.content}`}
                            </React.Fragment>
                        }
                    />
                    {
                        props.comment.user.email === props.currentUser.email ? // בודקים האם בתגובה היא של היוזר המחובר ואם כן יהיה יכול למחוק
                            <ListItemSecondaryAction>
                                <Grid>
                                    <IconButton onClick={handleDelete} aria-label="delete" className={classes.btn} component="label">
                                        <DeleteIcon fontSize="default" />
                                    </IconButton>
                                </Grid>
                            </ListItemSecondaryAction>
                            :
                            null
                    }
                </ListItem>
                <Grid style={{ marginLeft: 70, textAlign: "left" }} item xs={12}>
                    {
                        props.comment.toRate ?
                            <Rating size="small" name="rating" value={props.comment.rating} readOnly />
                            :
                            "No rate"
                    }
                </Grid>
                <Divider component="li" />
            </React.Fragment>
        );
    };

    const handleDelete = () => { // מוחק תגובה ומעדכן את הרשימה
        props.deleteComment(props.movieId, props.index);
        props.updateComments();
    };

    return renderedComment();
};

export default withRouter(Comment);