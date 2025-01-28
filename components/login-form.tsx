"use client"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {toast} from 'react-toastify'
import ErrorAlert from "@/components/error-alert";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  error?: string | null;
}

export function LoginForm({
                            className,
                            error,
                            ...props
                          }: LoginFormProps) {

  const showToast = () => {
    toast.warning('Funzionalità non ancora implementata, contatta l\'amministratore per assistenza')
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Area riservata soci</CardTitle>
          <CardDescription>
            Gestisci le tue iscrizioni, i tuoi dati e le tue prestazioni
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="info@atleticapadrepio.it"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  onClick={showToast}
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Password dimenticata?
                </a>
              </div>
              <Input id="password" name="password" type="password" required/>
            </div>
            <Button type="submit" className="w-full">
              Accedi
            </Button>
            <ErrorAlert error={error} />
          </div>
          <div className="mt-5 text-center text-sm">
            Non sei ancora socio?{" "}
            <a href="#" onClick={showToast} className="underline underline-offset-4">
              Invia la richiesta
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
