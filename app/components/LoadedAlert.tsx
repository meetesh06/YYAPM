import { useState } from "react"
import { Alert, Button, Form, Stack } from "react-bootstrap"
import { BiInfoCircle } from "react-icons/bi"

interface C_Props {
  savedState: boolean,
  transition: boolean,
  show: boolean,
  t_initiateSave: (arg0: string) => void,
  t_reset: any
};

const Comp: React.FC<C_Props> = ({savedState, transition, show, t_initiateSave, t_reset}) => {
  const [master, setMaster] = useState("")
  const handleSave = () => {
    t_initiateSave(master)
  }
  
  return(
    <Alert transition={transition} show={show} variant={savedState ? "success" : "warning"}>
      <Stack className="d-flex justify-content-end" direction="horizontal" gap={3}>
        <BiInfoCircle size={25}/> 
        <div className="p-2 me-auto">
          {savedState && "Saved"}
          {!savedState && "Not Saved"}
          
          
        </div>
        <div className="input-group w-auto">
          <Form.Control
            value={master}
            onChange={(e) => setMaster(e.target.value)}
            required
            type="password"
            placeholder="File Password"
          />
        </div>
        <Button disabled={master === ""} onClick={handleSave} variant="primary">
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