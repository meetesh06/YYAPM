import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
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
      <Card style={{ padding: 0 }} bg="warning" className='notecard'>
        <Card.Header>
          <Card.Title style={{ fontFamily: 'cursive', fontWeight: "bold", fontSize: 25 }}>
            {title}
          </Card.Title>
        </Card.Header>
        <Card.Body style={{ fontFamily: 'monospace', fontSize: 12 }}>
          {note.split("\n").map((text, idx) => <div key={`${text}-${idx}`}>{text}</div>)}
        </Card.Body>
        <Card.Footer>
          <p style={{ fontFamily: 'monospace', fontSize: 9, }}>
            {date.toLocaleString()} 
          </p>
          <Button onClick={remove} variant='outline-danger'>
            <AiFillDelete />
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default Comp;