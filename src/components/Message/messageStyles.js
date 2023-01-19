export const messageStyles = ({
    isMine = true,
    displayMenuButton = false,
    isLastInColumn = false,
    isFirstInColumn = false,
    isEmoji = false
}) => ({
    messageContainer: {
        width: "100%",
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        position: "relative",
        margin: "2px 0",
        marginRight: isMine ? "0" : "25px",
        alignItems: "flex-end",
        flexDirection: "row",
        "&::before": {
            content: "''",
            position: "absolute",
            display: "flex",
            width: "calc(100% + 60px)",
            height: "100%",
            zIndex: "-2",
            transition: "0.1s ease",
            marginLeft: "-10px"
        },
    },
    MenuButton: {
        position: "absolute",
        borderRadius: "20px",
        zIndex: "4",
        boxShadow: "inset 0 0 2px 1px #012e30",
        dispaly: "flex",
        bottom: "100%",
        // top: "0",
        background: "linear-gradient(45deg, #012e30, #001a1c)",
        transition: "0.1s ease",
        opacity: "0.5",
        width: "max-content",
        maxWidth: "290px",
        transform: displayMenuButton ? "translate(20px, 50%) scale(1)" : "translate(20px, 50%) scale(0)",
        position: "absolute",
        "&:hover": {
            opacity: "1",
        }
    },
    replyStyling: {
        overflow: "hidden",
        maxHeight: "80px",
        cursor: "pointer",
        color: "text.secondary",
        boxShadow: "inset 1px -1px 2px 0 #fff",
        borderRadius: "15px 15px 2px 2px",
        paddingLeft: "10px",
        paddingBottom: "10px",
        background: isMine ? "linear-gradient(90deg, #0c3818, #135c27)" : "linear-gradient(45deg, #012e30, #001a1c)",
        marginBottom: "10px",
        width: "100%",
        fontSize: "16px",
    },
    animationClass: {
        transformOrigin: "right",
        animation: "$myEffect 2s",
    },
    Chip: {
        transition: "0.2s ease",
        animation: `$chip-animation-in 0.2s`,
        transform: "scale(1)",
        background: "background.paper",
        color: "text.secondary",
        marginBottom: "-10px",
        marginTop: "5px",
        marginRight: "2px",
    },
    ChipsBlock: {
        display: "flex",
        justifyContent:"flex-end",
        width: "100%",
        fontSize: "16px",
    },
    ChipLeave: {
        opacity: 0,
        transform: "translateY(200%)"
    },
    ReactionChipAvatarGroup: {
        width: "max-content !important",
        height: "auto",
        dispaly: "flex",
        alignItems: "center"
    },
    ReactionChip: {
        color: "text.secondary",
        // marginLeft: "auto",
        animation: "$reaction 0.2s",
        marginBottom: "-10px",
        marginTop: "5px",
        marginRight: "2px",
        // animation: "$reaction 0.2s",
        fontSize: "19px",
        display: "flex",
        alignItems: "center",
        // alignItems: "flex-end",
        transition: "0.2s ease",
        textShadow: "none",
        "& .css-wjsjww-MuiChip-label": {
            paddingRight: "0"
        },
    },
    Reaction: {
        transition: "0.1s ease",
        animation: "$reaction 0.1s",
        textShadow: "0 0 0 0 black",
        background: "",
        color: "text.main",
        "&:hover": {
            transform: "scale(1.2)",
            textShadow: "0 0 0 5px black",
        }
    },

    messageStyling: {
        // marginLeft: "70px",
        maxWidth: "400px",
        minWidth: "50px",
        textShadow: "#000 1px 0 3px",
        overflowWrap: "break-word",
        background: !isEmoji && (isMine ? "linear-gradient(130deg, #0c3818, #135c27)" : "linear-gradient(45deg, #012e30, #001a1c)"),
        boxShadow: !isEmoji ? (isMine ? "inset 1px 0 2px 1px #135c27" : "inset -1px 0 0 1px #012e30") : "inset 0 0 2px 0 #012e30",
        padding: (isLastInColumn && isMine) ? "10px" : "10px 10px 15px 10px",
        paddingTop: isEmoji ? "0" : "10px",
        paddingLeft: isEmoji ? "0" : (isMine ? "20px" : "10px"),
        paddingRight: isEmoji ? "0" : (isMine ? "10px" : "20px"),
        borderRadius: isMine ?
        (isLastInColumn ? "30px 10px 10px 30px" : isFirstInColumn ? "30px 30px 10px 30px" : "30px 10px 10px 30px")
        :
        (isLastInColumn ? "10px 30px 30px 10px" : isFirstInColumn ? "30px 30px 30px 10px" : "5px 30px 30px 5px"),
        // paddingRight: isMine ? "10px" : "20px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        marginLeft: isMine ? "0" : "20px",
        fontSize: isEmoji && "70px",
        alignItems: "flex-end",
    
        "&::before": (isLastInColumn && !isEmoji) ? {
            content: "''",
            display: "block",
            position: "absolute",
            height: "30px",
            zIndex: "-1",
            boxShadow: isMine ? "-40px 0 0 -0.5px #135c27" : "40px 0 0 -0.5px #012e30",
            width: "100px",
            right: 0,
            top: "100%",
            transform: "translateY(-100%)",
            borderRadius: isMine ? "0  2px 0 40px" : "0 2px 40px 0",
            left: isMine ? "100%" : "none",
            right: isMine ? "none" : "100%",
        } : {}
    }

})