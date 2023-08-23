import { useState } from "react"
import { Alert, Button, Form, Stack } from "react-bootstrap"
import { BiShield } from "react-icons/bi"

interface C_Props {
  transition: boolean,
  show: boolean,
  t_loadExisting: any,
  t_createNew: any
};

const Comp: React.FC<C_Props> = ({transition, show, t_loadExisting, t_createNew}) => {

  const [fileStateError, setFileStateError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: any) => {
    setLoading(true);
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      

      reader.onload = (event: any) => {
        if (event) {
          const contents = event.target.result;
          setLoading(false);
          t_loadExisting(contents);
        } else {
          setFileStateError(true)
          setLoading(false);
        }
      };

      await reader.readAsText(file);
    } else {
      setFileStateError(true);
      setLoading(false);
    }
  }
  return(
    <Alert transition={transition} show={show} variant="success">
      <Alert.Heading>Welcome to Key-<BiShield/>-Rama</Alert.Heading>
      <p>
      Offline Simple, Encrypted and Open source password manager. <br/> 
      </p>
      <hr />
      <Stack className="d-flex justify-content-end" direction="horizontal" gap={3}>
        {
          fileStateError &&
          <div className="invalidAlertText">
            Loaded file is invalid
          </div>
        }
        <div>
          <Form.Group 
            controlId="formFile"
          >
            <Form.Control
              disabled={loading}
              onChange={handleChange}
              type="file"
            />
          </Form.Group>
        </div>
        <div className="vr" />
        <Button 
          disabled={loading}
          onClick={t_createNew}
          variant="success"
        >
          Get Started
        </Button>
      </Stack>
    </Alert>
  )
}
export default Comp