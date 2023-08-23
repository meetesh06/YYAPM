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
  const [noteTitle, setNoteTitle] = useState("");
  const [noteNote, setNoteNote] = useState("");

  const updateNoteTitle = (e: any) => {
    if (e && e.target) {
      setNoteTitle(e.target.value);
    } else {
      console.error("Trying to set an invalid master password");
    }
  }

  const updateNoteNote = (e: any) => {
    if (e && e.target) {
      setNoteNote(e.target.value);
    } else {
      console.error("Trying to set an invalid master password");
    }
  }
  
  const addNote = () => {
    transition({
      tag: "note",
      date: new Date(),
      title: noteTitle,
      note: noteNote
    });
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
          <Modal.Title>Add a new note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="My Quotes"
              value={noteTitle}
              onChange={updateNoteTitle}
              autoFocus
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Note</Form.Label>
            <Form.Control 
              onChange={updateNoteNote}
              as="textarea" 
              value={noteNote}
              placeholder="Logic Processed Infinitely is Emotion ~ M" 
              rows={3} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={noteTitle === ""} variant="outline-primary" onClick={addNote}>Add</Button>
        <Button variant="outline-danger" onClick={close}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Comp;