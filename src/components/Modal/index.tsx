import React from 'react';
import MaterialModal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%)`,
    },
  }),
);

type ModalProps = {
  open: boolean;
  onClose: (event: object, reason: string) => void;
  children: any;
};

/**
 * @param {ModalProps} props
 */
const Modal = (props: ModalProps) => {
  const { open, onClose, children } = props;
  const classes = useStyles();

  return (
    <MaterialModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div className={classes.modal}>{children}</div>
    </MaterialModal>
  );
};

export default Modal;
