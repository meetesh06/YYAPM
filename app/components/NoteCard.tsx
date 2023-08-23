import Card from 'react-bootstrap/Card';

interface C_Props {
  title: string,
  note: string,
  date: Date
};


const Comp: React.FC<C_Props> = ({title, note, date}) => {
  return (
    <div className='notecard-container'>
      <Card bg={"warning"} text={"muted"} className='notecard'>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            {note.split("\n").map((text) => <div>{text}</div>)}
          </Card.Text>
          <Card.Footer>
            {date.toLocaleString()} 
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Comp;