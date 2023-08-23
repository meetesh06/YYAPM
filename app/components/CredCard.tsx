import { Button, Form, Stack } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

type CredData = {
  key: string,
  value: string
}

interface C_Props {
  title: string,
  kvp: Array<CredData>,
  date: Date
};


const Comp: React.FC<C_Props> = ({title, kvp, date}) => {
  return (
    <div className='notecard-container'>
      <Card bg={"secondary"} text={"light"} className='notecard'>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Body>
          {
            kvp.map((ele, idx) => {

              return (
                <Form.Group key={`cred-field-${idx}`} className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>{ele.key}</Form.Label>
                  <Stack direction={"horizontal"} gap={1}>
                    <Form.Control
                      value={kvp[idx].value}
                    />
                    {/* <Button 
                      variant="outline-danger" 
                    >
                      Show
                    </Button> */}
                  </Stack>
                </Form.Group>
              )
            })
          }
          </Card.Body>
          <Card.Footer>
            {date.toLocaleString()} 
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Comp;