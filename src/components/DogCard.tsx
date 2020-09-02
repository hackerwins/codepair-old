import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { CardMedia, CircularProgress } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState } from '../store/store';
import { loadDogAction } from '../actions/dogActions';

const useStyles = makeStyles({
  root: {
    minWidth: 500,
    minHeight: 500,
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '40%',
  },
  image: {
    height: 0,
    paddingTop: '0%',
  },
  img: {
    width: 500,
    height: 500,
  },
});

export default function DogCard() {
  //this object represents the classes that we defined
  const classes = useStyles();
  //here we declare what we want to take from the redux store with the useSelector() hook
  //every time one of these properties is updated on the store, our component will re-render to reflect it
  const dogPic = useSelector((state: IAppState) => state.dogState.image);
  const loading = useSelector((state: IAppState) => state.dogState.loading);
  const errorMessage = useSelector(
    (state: IAppState) => state.dogState.errorMessage,
  );
  //this hook allows us to access the dispatch function
  const dispatch = useDispatch();
  //here we define simple stateless components for the card image and error messages
  //notice how we dispatch the call to end the loading of the image based on the img element's onLoad event
  const cardImage = (src: string) => (
    <CardMedia className={classes.image}>
      <img
        alt="doggo"
        className={classes.img}
        onLoad={() => dispatch(loadDogAction(false))}
        src={src}
      ></img>
    </CardMedia>
  );

  const cardError = (message: string) => (
    <Typography color="error">{message}</Typography>
  );

  return (
    <Card className={classes.root}>
      {dogPic ? cardImage(dogPic) : ''}
      <CardContent className={classes.cardContent}>
        {!loading && !dogPic && !errorMessage ? (
          <Typography>Waiting for doggo...</Typography>
        ) : (
          ''
        )}
        {loading ? (
          <CircularProgress size="80px" color="primary"></CircularProgress>
        ) : (
          ''
        )}
        {errorMessage && !dogPic && !loading ? cardError(errorMessage) : ''}
      </CardContent>
    </Card>
  );
}
