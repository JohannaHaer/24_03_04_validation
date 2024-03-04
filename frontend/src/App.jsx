
import { useContext, useRef } from 'react'
import './App.css'
import { mainContext } from '../context/mainProvider'

function App({}) {
  const {guests, addGuest, setGuests} = useContext(mainContext)
  
  const formRef = useRef()

  // !Submit Funktion

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(formRef.current)
    await addGuest(formData)
    formRef.current.reset()
  }

  return (
    <section>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input required type="text" name="surename" placeholder='Vorname'/>
        <input required type="text" name="lastname" placeholder='Nachname'/>
        <input required type="email" name="email" placeholder='E-Mail'/>
        <input required type="text" name="message" placeholder='Nachricht'/>
        <button>Submit</button>
      </form>
      <article>
        {
          guests.map((guest) => {
            return(
              <div key={guest.id}>
                <div >
                  <h3>{guest.surename}</h3>
                  <p>{guest.email}</p>
                  <p>schreibt:</p>
                </div>
                <div>
                  <p>{guest.message}</p>
                </div>
              </div>
            )
          })
        }
      </article>
    </section>
  )
}

export default App
