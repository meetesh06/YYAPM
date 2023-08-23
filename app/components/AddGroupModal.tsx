import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface C_Props {
  show: boolean,
  transition: any,
  close: any
};


const Comp: React.FC<C_Props> = ({show, transition, close}) => {
  const [groupName, setGroupName] = useState("");

  const updateGroupText = (e: any) => {
    if (e && e.target) {
      setGroupName(e.target.value);
    } else {
      console.error("Trying to set an invalid master password");
    }
  }
  
  const addGroup = () => {
    setGroupName("");
    transition(groupName);
    close();
  }


  return (
    <Modal 
      show={show} 
      fullscreen={'sm-down'} 
      onHide={close}
      centered
    >
      <Modal.Header closeButton>
          <Modal.Title>Add a new group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Work"
              autoFocus
              value={groupName}
              onChange={updateGroupText}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={groupName === ""} variant="outline-primary" onClick={addGroup}>Save</Button>
        <Button variant="outline-danger" onClick={close}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Comp;