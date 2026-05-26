const Notification = ({message}) => {
    if (message === null || message === undefined) {
        return null
    }
    return (
        <div className="notice">
            {message}
        </div>
    )
}

export default Notification
