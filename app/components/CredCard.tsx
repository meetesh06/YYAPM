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
  const [showCopied, setShowCopied] = useState(-1);
  return (
    <div className='notecard-container'>
      <Card  className='notecard'>
        <Card.Header style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: 14 }}>
            {title}
        </Card.Header>
        <Card.Body style={{ fontFamily: 'monospace', fontSize: 10 }}>
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
                  <Button style={{ marginLeft: 5 }} onClick={() => { setShowCopied(idx); setTimeout(() => setShowCopied(-1), 1500); copyToClipboard(kvp[idx].value)}} variant='outline-dark'>
                    {showCopied !== idx && <AiOutlineCopy />}                    
                    {showCopied === idx && <div> Copied </div>}
                  </Button>
                </Stack>
              </Form.Group>
            )
          })
        }
        <p style={{ marginTop: 15, fontFamily: 'monospace', fontSize: 8, }}>
          {date.toLocaleString()} 
        </p>
        </Card.Body>
        <Card.Footer>
          <Stack direction='horizontal'>
            <div className="me-auto" />
            <Button  style={{ marginRight: 5 }} onClick={() => setPasswordVisible((old) => !old)} variant='outline-dark'>
              {
                passwordVisible && <AiFillEyeInvisible/>
              }
              {
                !passwordVisible && <AiFillEye/>
              }
            </Button>
            <Button onClick={remove} variant='outline-danger'>
              <AiFillDelete />
            </Button>
          </Stack>
        </Card.Footer>
      
      </Card>
    </div>
  );
}

export default Comp;