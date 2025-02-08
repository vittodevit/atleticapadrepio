import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import ConditionalHider from "@/components/conditional-hider";
import Link from "next/link";

interface ErrorAlertProps extends React.ComponentPropsWithoutRef<"div"> {
  error?: string | null;
  isSuccess?: boolean;
}

export default function ErrorAlert(
  {
    className,
    error,
    isSuccess,
    ...props
  }: ErrorAlertProps) {
  return error ? (
    <div className={className} {...props}>
      <Alert variant={isSuccess ? "default" : "destructive"}>
        <AlertCircle className="h-4 w-4"/>
        <AlertTitle className="font-semibold">
          {isSuccess ? "Operazione completata" : "Errore"}
        </AlertTitle>
        <ConditionalHider hidden={isSuccess === true}>
          <AlertDescription className="break-words max-w-xs">
            {error}
          </AlertDescription>
        </ConditionalHider>
        <ConditionalHider hidden={!isSuccess}>
          <AlertDescription>
            La passsword temporanea appena creata è:{" "}
            <span className="font-semibold">
              {error}
            </span><br/>
            Conservala in questo momento perchè non sarà più visibile! <br />
            <Link href="/dashboard/anagrafica" className="underline font-medium">
              Torna alla lista soci
            </Link>
          </AlertDescription>
        </ConditionalHider>
      </Alert>
    </div>
  ) : null;

}