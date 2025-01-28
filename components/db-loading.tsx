import React from 'react';
import {DatabaseZap} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

const DbLoading: React.FC = () => {
  return (
    <Alert>
      <DatabaseZap className="h-4 w-4"/>
      <AlertTitle className="font-semibold">Caricamento</AlertTitle>
      <AlertDescription>
        Operazione sul database in corso...
      </AlertDescription>
    </Alert>
  );

}

export default DbLoading;