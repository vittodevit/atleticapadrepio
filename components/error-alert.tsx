import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

interface ErrorAlertProps extends React.ComponentPropsWithoutRef<"div"> {
  error?: string | null;
}

export default function ErrorAlert({
                            className,
                            error,
                            ...props
                          }: ErrorAlertProps) {

  return error ? (
    <div className={className} {...props}>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4"/>
        <AlertTitle className="font-semibold">Errore</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    </div>
  ) : null;

}