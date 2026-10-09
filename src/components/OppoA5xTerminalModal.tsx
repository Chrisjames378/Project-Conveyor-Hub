import React from 'react';
import { OppoA6xTerminalModal, OppoA6xTerminalModalProps } from './OppoA6xTerminalModal';

export type OppoA5xTerminalModalProps = OppoA6xTerminalModalProps;

// Re-export OppoA6xTerminalModal for backward compatibility
export const OppoA5xTerminalModal: React.FC<OppoA5xTerminalModalProps> = (props) => {
  return <OppoA6xTerminalModal {...props} />;
};

export { OppoA6xTerminalModal };
