import { ref, set } from "firebase/database"
import { removeWrongSymbols } from "./removeWrongSymbols"

export const setReactionForMessage = (db, selectedChat, userEmail, i, reaction) => {
    set(ref(db, `${selectedChat}/messages/${i}/reactions/${removeWrongSymbols(userEmail)}`), reaction)
}