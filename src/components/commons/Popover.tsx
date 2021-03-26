import React, { ReactNode } from 'react';
import { Popover as MaterialPopover, PopoverOrigin } from '@material-ui/core';

interface PopoverProps {
  anchorEl: Element | undefined;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  children: ReactNode;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}

/**
 * @see https://material-ui.com/components/popover/#popover
 */
export default function Popover({ anchorEl, onClose, children, anchorOrigin, transformOrigin }: PopoverProps) {
  const isOpen = Boolean(anchorEl);

  return (
    <MaterialPopover
      id={isOpen ? 'simple-popover' : undefined}
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      {children}
    </MaterialPopover>
  );
}

Popover.defaultProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
};
