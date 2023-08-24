import Card from 'react-bootstrap/Card';
import { Button, Stack } from 'react-bootstrap';
import { AiFillEyeInvisible, AiFillEye, AiFillDelete } from 'react-icons/ai';

interface C_Props {
  title: string,
  note: string,
  date: Date,
  remove(): void
};


const Comp: React.FC<C_Props> = ({title, note, date, remove}) => {
  return (
    <div className='notecard-container'>
      <Card style={{ padding: 0 }} className='notecard'>
        <Card.Header style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold' }}>
          {title}
        </Card.Header>
        <Card.Body style={{ fontFamily: 'monospace', fontSize: 10, textAlign: 'justify' }}>
          {note.split("\n").map((text, idx) => <div key={`${text}-${idx}`}>{text}</div>)}
          <p style={{ marginTop: 15, fontFamily: 'monospace', fontSize: 8, }}>
            {date.toLocaleString()} 
          </p>
        </Card.Body>
        <Card.Footer>
          <Stack direction='horizontal'>
            <div className="me-auto" />
            <Button size="sm" onClick={remove} variant='outline-danger'>
              <AiFillDelete />
            </Button>
          </Stack>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default Comp;