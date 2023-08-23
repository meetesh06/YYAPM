import { useState } from 'react';
import { Button, Form, Stack } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { AiFillEyeInvisible, AiFillEye, AiFillDelete, AiOutlineCopy } from 'react-icons/ai';
type CredData = {
  key: string,
  value: string
}

interface C_Props {
  title: string,
  kvp: Array<CredData>,
  date: Date,
  remove(): void
};

const copyToClipboard = (text:string) => {
  navigator.clipboard.writeText(text)
    .catch((error) => {
      console.error("Copy to clipboard failed");
    });
}


const Comp: React.FC<C_Props> = ({title, kvp, date, remove}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <div className='notecard-container'>
      <Card bg="light" className='notecard'>
        <Card.Header>
          <Card.Title style={{ fontFamily: 'cursive', fontWeight: "bold", fontSize: 25 }}>
            {title}
          </Card.Title>
        </Card.Header>
        <Card.Body style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 'lighter' }}>
        {
          kvp.map((ele, idx) => {
            return (
              <Form.Group key={`cred-field-${idx}`} className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Text id="passwordHelpBlock" muted>
                  {ele.key}
                </Form.Text>
                <Stack direction='horizontal'>
                  <Form.Control
                    type={passwordVisible ? "text" : "password"}
                    value={kvp[idx].value}
                    onChange={(e) => e}
                  />
                  <Button style={{ marginLeft: 5 }} onClick={() => copyToClipboard(kvp[idx].value)} variant='outline-warning'>
                    <AiOutlineCopy />
                  </Button>
                </Stack>
              </Form.Group>
            )
          })
        }
        </Card.Body>
        <Card.Footer>
          <p style={{ fontFamily: 'monospace', fontSize: 9, }}>
            {date.toLocaleString()} 
          </p>
          <Button style={{ marginRight: 5 }} onClick={() => setPasswordVisible((old) => !old)} variant='outline-primary'>
            {
              passwordVisible && <AiFillEyeInvisible/>
            }
            {
              !passwordVisible && <AiFillEye/>
            }
          </Button>
          <div className="vr" />
          <Button onClick={remove} variant='outline-danger'>
            <AiFillDelete />
          </Button>
        </Card.Footer>
      
      </Card>
    </div>
  );
}

export default Comp;