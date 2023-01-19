import { Dialog, DialogTitle } from "@mui/material"

export const DeleteDialog = ({opened}) => {
    return (
        <Dialog
            open={opened}
        >
            <DialogTitle>
                Do you realy want to delete this message?
            </DialogTitle>
        </Dialog>
    )
}