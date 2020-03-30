import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({}))

const ConfirmationDialog = props => {
  const { onClose, onConfirm, open, title, ...other } = props
  const classes = useStyles()

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    onConfirm()
  }

  return (
    <Dialog
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      onClose={handleCancel}
      {...other}
    >
      <DialogTitle disableTypography id="confirmation-dialog-title">
        <Typography variant="h3" component="h2" style={{ marginTop: '8px' }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogActions
        style={{ padding: '8px 16px 24px', justifyContent: 'center' }}
      >
        <Button onClick={handleCancel} autoFocus variant="contained">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary" variant="contained">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default ConfirmationDialog
