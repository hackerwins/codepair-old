import React, { ReactNode } from 'react';
import { Popover as MaterialPopover } from '@material-ui/core';

interface PopoverProps {
  anchorEl: Element | undefined;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  children: ReactNode;
}

/**
 * @see https://material-ui.com/components/popover/#popover
 */
export default function Popover({ anchorEl, onClose, children }: PopoverProps) {
  const isOpen = Boolean(anchorEl);

  return (
    <MaterialPopover
      id={isOpen ? 'simple-popover' : undefined}
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {children}
    </MaterialPopover>
  );
}
