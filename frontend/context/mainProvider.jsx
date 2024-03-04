import React, { createContext, useEffect } from 'react'
import { useState } from 'react'

export const mainContext = createContext()
const MainProvider = ({children}) => {
    const [guests, setGuests] = useState([])

    // !Guest adden

    const addGuest = async (guestData) => {
        try {
            await postGuest(guestData)
            updateGuest()
        } catch (err) {
            console.error(err);
        }
    }

    // !Guest posten
    const postGuest = (newGuestData) => fetch("http://localhost:3000/guest", {method: "POST", body: newGuestData}).then((response) => response.json())

    const updateGuest = async () => {
        try {
            setGuests(await getGuest())
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        updateGuest()
    }, [])
    

    // !Guest aus Backend empfangen
    const getGuest = () => fetch("http://localhost:3000/guest").then((response) => response.json())
    return (
        <mainContext.Provider value={{addGuest, guests, setGuests}}>
            {children}
        </mainContext.Provider>
    )
}

export default MainProvider