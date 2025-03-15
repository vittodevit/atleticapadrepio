export default function Home() {
  return(
    <>
      <div className="p-4 pl-0 pr-0 mx-4 md:mx-0">
        <h1 className="text-2xl font-medium">Contatti e Link Utili</h1>
        <div className="p-5 bg-white shadow-md mt-4">
          Benvenuti nella pagina di contatti dell’Atletica Padre Pio di San Giovanni Rotondo.
          Per entrare in contatto con il nostro staff, per qualsiasi richiesta di informazioni,
          puoi inviare un’email a <a href="mailto:info@atleticapadrepio.it">info@atleticapadrepio.it</a> <br/> <br/>

          Presidente: <b>NICOLA PLACENTINO</b>

          <hr className="mt-4 mb-4" />

          <h2 className="text-lg font-medium">Link Utili</h2>
          <a href="/csp10.pdf" className="underline text-blue-800">Modulo di iscrizione - Corri San Pio 10a edizione - Non competitiva</a> <br/>
          <a href="/sc3.pdf" className="underline text-blue-800">Modulo di iscrizione - Simpatiche Canaglie 3a edizione</a>
        </div>
      </div>
    </>
  )
}