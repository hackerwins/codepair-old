import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SimpleCard from '../components/SimpleCard';
import { Container } from '@material-ui/core';
import DogCard from '../components/DogCard';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100vh',
  },
});

export default function HomePage() {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <SimpleCard />
      <DogCard />
    </Container>
  );
}
