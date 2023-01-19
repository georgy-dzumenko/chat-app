import { ref, set } from "firebase/database"

export const deleteMessage = (db, selectedChat, i) => {
    set(ref(db, `${selectedChat}/messages/${i}/status`), "deleted")
    set(ref(db, `${selectedChat}/messages/${i}/content`), "")
}