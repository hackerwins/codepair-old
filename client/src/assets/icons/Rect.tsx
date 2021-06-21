import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

export default function Mouse({ fontSize }: SvgIconProps) {
  return (
    <SvgIcon fontSize={fontSize}>
      <svg enableBackground="new 0 0 506.1 506.1" viewBox="0 0 506.1 506.1" xmlns="http://www.w3.org/2000/svg">
        <path d="m489.609 506.1h-473.118c-9.108 0-16.491-7.384-16.491-16.491v-473.118c0-9.108 7.383-16.491 16.491-16.491h473.119c9.107 0 16.49 7.383 16.49 16.491v473.118c0 9.107-7.383 16.491-16.491 16.491zm-456.628-32.982h440.138v-440.137h-440.138z" />
      </svg>
    </SvgIcon>
  );
}
