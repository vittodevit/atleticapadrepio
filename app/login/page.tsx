import {LoginForm} from "@/components/login-form"
import {auth, signIn} from "@/auth";
import {redirect} from "next/navigation";

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined, error: string | undefined }
}) {
  const sp = await props.searchParams;
  const redirUrl = sp.callbackUrl || "/dashboard";

  const session = await auth();
  if (session?.user) {
    redirect(redirUrl);
  }

  const signInAction = async (formData: FormData) => {
    "use server"
    try {
      await signIn("credentials", formData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (ignored) {
      redirect(`/login?error=credentials`);
    }
    const session = await auth();
    console.log(session);
    if (!session?.user) redirect(`/login?error=session`);
    redirect(redirUrl);
  }

  if (sp.error == "credentials") {
    sp.error = "Credenziali non valide";
  }

  if (sp.error == "session") {
    sp.error = "Sessione scaduta, per favore riavvia il browser";
  }

  return (
    <form className="form-signin" action={signInAction}>
      <section>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm error={sp.error}/>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-overcolor w-100">
          Accedi
        </button>
      </section>
    </form>
  )
}