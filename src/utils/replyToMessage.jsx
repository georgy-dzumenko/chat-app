import { ref, set } from "firebase/database"

export const replyToMessage = (db, selectedChat, messagesLength, newMessage, email, isReplyTo) => {
    const newDate = new Date();
    set(ref(db, `${selectedChat}/messages/${messagesLength}`), {
        user: email,
        content: newMessage,
        date: newDate.toJSON(),
    });
    set(ref(db, `${selectedChat}/messages/${messagesLength}/isReplyTo`), isReplyTo)
}