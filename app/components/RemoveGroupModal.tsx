import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface C_Props {
  show: boolean,
  current: string,
  transition: any,
  close: any
};


const Comp: React.FC<C_Props> = ({show, current, transition, close}) => {

  const [remName, setRemName] = useState("");
  
  const addGroup = () => {
    transition();
    close();
  }

  const updateGroupText = (e: any) => {
    if (e && e.target) {
      setRemName(e.target.value);
    } else {
      console.error("Something wrong in the remove group component!");
    }
  }

  return (
    <Modal 
      show={show} 
      fullscreen={'sm-down'} 
      onHide={close}
      centered
    >
      <Modal.Header closeButton>
          <Modal.Title>Remove group <b>{current}</b>?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to do this, if yes, type the name of the group in the textbox below.
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Note :o, this cannot be undone"
              autoFocus
              value={remName}
              onChange={updateGroupText}
            />
          </Form.Group>
        </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" disabled={remName !== current} onClick={addGroup}>Remove</Button>
        <Button 
          variant="outline-primary" onClick={close}>Go Back</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Comp;