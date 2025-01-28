"use client";
import React, { useEffect } from 'react';
import { usePageTitle } from "@/components/page-title-context";

interface BreadcrumbInjectorProps {
  pageTitle: string;
}

const BreadcrumbInjector: React.FC<BreadcrumbInjectorProps> = ({ pageTitle }) => {
  const { updatePageTitle } = usePageTitle();

  useEffect(() => {
    updatePageTitle(pageTitle);
  }, [pageTitle]);

  return null;
};

export default BreadcrumbInjector;