import React, { ReactNode } from 'react';
import MaterialModal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  }),
);

interface ModalProps {
  open: boolean;
  onClose: (event: object, reason: string) => void;
  children: ReactNode;
}

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
