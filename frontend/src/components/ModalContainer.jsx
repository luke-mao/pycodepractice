import React from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * ModalContainer Component
 *
 * A reusable modal dialog with customizable title, body, confirmation/cancellation buttons, and handlers.
 * Used for displaying alerts, confirmations, and messages throughout the app.
 */
export default function ModalContainer({
  show,
  title,
  body,
  okText = "OK",
  cancelText = "Cancel",
  showCancelButton = false,
  onOk,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>

      <Modal.Footer>
        {showCancelButton && (
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
        )}
        <Button variant="primary" onClick={onOk}>
          {okText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
