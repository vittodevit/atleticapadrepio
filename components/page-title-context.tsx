"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageTitleContextType {
  pageTitleData: string;
  updatePageTitle: (ptData: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export const PageTitleProvider = ({ children }: { children: ReactNode }) => {
  const [pageTitleData, setPageTitleData] = useState<string>("");
  const updatePageTitle = (d: string) => setPageTitleData(d);

  return (
    <PageTitleContext.Provider value={{ pageTitleData, updatePageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error("usePageTitle must be used within pageTitleProvider");
  }
  return context;
};
