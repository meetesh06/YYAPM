import { useState } from "react"
import { Alert, Button, Form, Stack } from "react-bootstrap"
import { BiInfoCircle } from "react-icons/bi"

interface C_Props {
  transition: boolean,
  show: boolean,
  rawData: string,
  t_unlock: any,
  t_reset: any
};


const Comp: React.FC<C_Props> = ({transition, show, rawData, t_unlock, t_reset}) => {
  async function decryptTextWithPassword(encryptedText: string, password: string) {
    const decoder = new TextDecoder();
    const encryptedData = Uint8Array.from(atob(encryptedText), byte => byte.charCodeAt(0));
  
    const salt = encryptedData.slice(0, 16);
    const iv = encryptedData.slice(16, 28);
    const ciphertext = encryptedData.slice(28);
  
    const passwordEncoder = new TextEncoder();
    const passwordData = passwordEncoder.encode(password);
  
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveKey']
    );
  
    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      cryptoKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      derivedKey,
      ciphertext
    );
  
    const decryptedText = decoder.decode(decryptedData);
    return decryptedText;
  }
  const [tried, setTried] = useState(0);
  const [masterPassword, setMasterPassword] = useState("");
  const try_unlock = async () => {
    await setTried((oldTried) => ++oldTried);
    try {
      const decryptedData =  await decryptTextWithPassword(rawData, masterPassword);
      const parsedData = await JSON.parse(decryptedData);
      t_unlock(parsedData)
    } catch(e) {
      console.error("Incorrect Password");
      setMasterPassword("");
    }
  }
  const updateMasterPassword = (e: any) => {
    if (e && e.target) {
      setMasterPassword(e.target.value);
    } else {
      console.error("Trying to set an invalid master password");
    }
  }
  return(
    <Alert transition={transition} show={show} variant="secondary">
      <Stack className="d-flex justify-content-end" direction="horizontal" gap={3}>
        <BiInfoCircle size={25}/> 
        <div className="p-2 me-auto">
          Enter your password to unlock your project.
        </div>
        <div className="input-group w-auto">
          <Form.Control
            isInvalid={tried > 0}
            disabled={tried > 5}
            required
            type="password"
            placeholder="Master Password"
            value={masterPassword}
            onChange={updateMasterPassword}
          />
        </div>
        <Button onClick={try_unlock} disabled={tried > 5 || masterPassword.length === 0} variant={ tried == 0 ? "primary" : "outline-danger"}>
          Unlock
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