import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (message === null || message === undefined) {
    return null
  }
  return (
    <Alert severity={message.type}>
      {message.text}
    </Alert>
  )
}

export default Notification
