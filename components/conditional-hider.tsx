import React from 'react';

interface ConditionalHiderProps {
  hidden: boolean;
  children: React.ReactNode;
}

const ConditionalHider: React.FC<ConditionalHiderProps> = ({ hidden, children }) => {
  if (hidden) {
    return null;
  }

  return <>{children}</>;
};

export default ConditionalHider;