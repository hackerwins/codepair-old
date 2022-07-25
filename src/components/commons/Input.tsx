import React, { ChangeEvent } from 'react';
import { Input as MaterialInput } from '@material-ui/core';

interface InputProps {
  id: string;
  className: string;
  onChange: (event: ChangeEvent) => void;
  value: string;
  type?: string;
  color?: 'primary' | 'secondary';
  disabled?: boolean;
}

/**
 * @see https://material-ui.com/components/input/#input
 */
export default function Input({ id, className,  disabled, value, type, onChange, color }: InputProps) {
  return (
    <MaterialInput
      id={id}
      className={className}
      color={color}
      disabled={disabled}
      value={value}
      type={type}
      onChange={onChange}
    />
  );
}

Input.defaultProps = {
  type: 'text',
  color: 'secondary',
  disabled: false,
};