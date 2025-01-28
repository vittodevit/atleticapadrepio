"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RenderContextType {
  triggerRender: () => void;
}

const RenderContext = createContext<RenderContextType | undefined>(undefined);

export const RenderProvider = ({ children }: { children: ReactNode }) => {
  const [renderKey, setRenderKey] = useState(0);

  const triggerRender = () => {
    setRenderKey(prevKey => prevKey + 1);
  };

  return (
    <RenderContext.Provider value={{ triggerRender }}>
      {React.cloneElement(children as React.ReactElement, { key: renderKey })}
    </RenderContext.Provider>
  );
};

export const useRender = () => {
  const context = useContext(RenderContext);
  if (!context) {
    throw new Error("useRender must be used within a RenderProvider");
  }
  return context;
};