import { Drawer } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { setInfoContent } from "../../redux/chat";

export const MessageInfo = () => {
    const open = useSelector(state => state.chat.info.status)
    // const i = useSelector(state => state.chat.info.open)
    const dispatch = useDispatch();

    return (
        <Drawer
            anchor={"bottom"}
            open={open}
            onClose={() => dispatch(setInfoStatus(false))}
        >
            {list(anchor)}
        </Drawer>
    )
}