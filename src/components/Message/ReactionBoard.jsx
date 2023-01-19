import { Reaction } from "./Reaction";

export const ReactionBoard = (props) => {
    const reactionsList = [
        "👍🏻", "👎🏻", "🖕🏻", "💪🏼", "👋🏻", "👌🏻", "👏🏻", "😀", "🤣", "😍", "🤬",
        "😢", "😭", "🤮", "🤡", "💩", "🐷", "⚰️", "🤔", "😱", "🤯", "😎",
        "🧠", "👀"
    ]

    return (<>
        {reactionsList.map((a) => <Reaction {...props} reaction={a}/>)}
    </>)
}