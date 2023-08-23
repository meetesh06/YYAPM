import { useState } from 'react';
import { Form, Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as crypto from "crypto";
interface C_Props {
  show: boolean,
  transition: any,
  close: any
};

type CredData = {
  key: string,
  value: string
}

function generateSecurePassword() {
  const length = 14
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';

  if (length < 1 || typeof length !== 'number') {
    throw new Error('Invalid password length. Length must be a positive number.');
  }

  let password = '';
  if (crypto && crypto.getRandomValues) {
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);

    for (let i = 0; i < length; i++) {
      password += charset[values[i] % charset.length];
    }
  } else {
    // Fallback to Math.random()
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }
  return password
}

const Comp: React.FC<C_Props> = ({show, transition, close}) => {
  const [credTitle, setCredTitle] = useState("");
  const [kvp, setKvp] = useState([{ key: "Email", value: "" }, { key: "Password", value: "" }] as Array<CredData>);

  const [newFieldValue, setNewFieldValue] = useState("");

  const updateCredTitle = (e: any) => {
    if (e && e.target) {
      setCredTitle(e.target.value);
    } else {
      console.error("Trying to set an invalid master password");
    }
  }

  const updateFieldValue = (e: any) => {
    if (e && e.target) {
      setNewFieldValue(e.target.value);
    } else {
      console.error("Trying to set an invalid master password");
    }
  }

  const addField = () => {
    setKvp((old) => [...old, { key: newFieldValue, value: "" }])
    setNewFieldValue("");
  }

  
  const addCred = () => {
    setCredTitle("");
    setKvp([{ key: "Email", value: "" }, { key: "Password", value: "" }] as Array<CredData>)
    setNewFieldValue("")
    transition({
      tag: "credential",
      date: new Date(),
      title: credTitle,
      kvp: kvp
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
          <Modal.Title>Add a new credential</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="Google - Personal"
              value={credTitle}
              onChange={updateCredTitle}
              autoFocus
            />
          </Form.Group>
          {
            kvp.map((ele, idx) => {

              return (
                <Form.Group key={`cred-field-${idx}`} className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>{ele.key}</Form.Label>
                  <Stack direction={"horizontal"} gap={3}>
                    <Form.Control
                      value={kvp[idx].value}
                      onChange={(v) => { setKvp((old) => { const newState = [...kvp]; newState[idx].value = v.target.value; return newState; }) }}
                    />
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setKvp((old) => old.map((ele, idxx) => { if (idxx === idx) { return { ...ele, value: generateSecurePassword() } } else { return ele }}))}
                    >
                      Generate
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => setKvp((old) => old.filter((ele, idxx) => idxx !== idx))}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Form.Group>
              )
            })
          }
        </Form>
        <hr />
        <Stack direction={"horizontal"} gap={3}>
          <Form.Control
            value={newFieldValue}
            onChange={updateFieldValue}
            className="me-auto"
            placeholder="Add new field"
          />
          <Button 
            disabled={newFieldValue === ""}
            variant="outline-success" 
            onClick={addField}
          >
            Add
          </Button>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={credTitle === ""} variant="outline-primary" onClick={addCred}>Add</Button>
        <Button variant="outline-danger" onClick={close}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Comp;