import { child, get, ref, set } from "firebase/database";
import { removeWrongSymbols } from "./removeWrongSymbols";

export const addToChatLists = (db, userData, friendData, newSelectedChat) => {
    const dbRef = ref(db)
    get(child(dbRef, `users/${removeWrongSymbols(friendData.email)}/chats`)).then((friendsChats) => {
        const friendsChatsValue = friendsChats.val() ? friendsChats.val() : [];
        if(!friendsChatsValue.includes(newSelectedChat)) {
            set(ref(db, `users/${removeWrongSymbols(friendData.email)}/chats/${friendsChatsValue.length}`), newSelectedChat);
        }
    })
    get(child(dbRef, `users/${removeWrongSymbols(userData.email)}/chats`)).then((userChats) => {
        const userChatsValue = userChats.val() ? userChats.val() : [];
        if(!userChatsValue.includes(newSelectedChat)) {
            set(ref(db, `users/${removeWrongSymbols(userData.email)}/chats/${userChatsValue.length}`), newSelectedChat);
            set(ref(db, `${newSelectedChat}/users`), [userData.email, friendData.email]);
        }
    })
}