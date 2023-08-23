import { Alert, Button, Form, Stack } from "react-bootstrap"
import { BiInfoCircle } from "react-icons/bi"

interface C_Props {
  transition: boolean,
  show: boolean,
  t_initiateSave: any,
  t_reset: any
};

const Comp: React.FC<C_Props> = ({transition, show, t_initiateSave, t_reset}) => {
  return(
    <Alert transition={transition} show={show} variant="primary">
      <Stack className="d-flex justify-content-end" direction="horizontal" gap={3}>
        <BiInfoCircle size={25}/> 
        <div className="p-2 me-auto">
          Remember to export your project.
        </div>
        <div className="input-group w-auto">
          <Form.Control
            required
            type="password"
            placeholder="File Password"
          />
        </div>
        <Button onClick={t_initiateSave} variant="primary">
          Export
        </Button>
        <div className="vr" />
        <Button onClick={t_reset} variant="danger">
          Close
        </Button>
      </Stack>
      <div className="d-flex justify-content-end">
      </div>
    </Alert>
  )
}
export default Comp