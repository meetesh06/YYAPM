'use client';

import React, { useState } from 'react';
import QRCode from "react-qr-code";

import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Card, Col, Container, Dropdown, Form, Nav, Navbar, Row, Stack, Tab } from 'react-bootstrap';

import { BiExport, BiInfoCircle, BiPlus, BiPlusCircle, BiShield, BiSolidShield } from 'react-icons/bi';

enum PasswordStoreState {
  Initial,
  NewStoreInMemory,
  LockedStoreLoaded,
  UnlockedStoreLoaded,
  UnlockedSafe,
  UnlockedTainted
};

enum TextType {
  Normal,
  Hidden
};


class Noteable {
  text: string;
  multiline: boolean;
  type: TextType;

  constructor(text: string = "", multiline: boolean = false, type: TextType = TextType.Normal) {
    this.text = text;
    this.multiline = multiline;
    this.type = type;
  }

  setText(text: string): void {
    this.text = text;
  }
  getText(): string {
    return this.text;
  }

  setMultiline(multiline: boolean): void {
    this.multiline = multiline;
  }
  
  getMultiline(): boolean {
    return this.multiline;
  }

  setType(type: TextType): void {
    this.type = type;
  }
  getType(): TextType {
    return this.type;
  }

};

class Containable {
  title: string;
  store: Map<string, Noteable>;

  constructor(title: string = "", store: Map<string, Noteable> = new Map<string, Noteable>()) {
    this.title = title;
    this.store = store;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getTitle(): string {
    return this.title;
  }

  getStore(): Map<string, Noteable> {
    return this.store;
  }

  addElement(key: string, value: Noteable): void {
    this.store.set(key, value);
  }

  getElement(key: string): Noteable | undefined {
    return this.store.get(key);
  }
}

class Note extends Containable {
  addField(key: string, text: string, multiline: boolean = true, type: TextType = TextType.Normal): void {
    this.addElement(key, new Noteable(text,multiline,type)); 
  }
}

class Password extends Containable {
  constructor() {
    super();
    this.addElement("email", new Noteable("",false,TextType.Normal));
    this.addElement("password", new Noteable("",false,TextType.Normal));
  }

  addField(key: string, text: string, multiline: boolean = false, type: TextType = TextType.Normal): void {
    this.addElement(key, new Noteable(text,multiline,type)); 
  } 
}

const usePasswordStoreState = () => {
  const [authState, setAuthState] = useState({state: PasswordStoreState.Initial, data: new Array<Containable>});

  const reset = () => {
    setAuthState((oldState) => {return { state: PasswordStoreState.Initial, data: new Array<Containable> }});
  }
  
  const initializeNewStoreInMemory = () : void => {
    console.log("initializeNewStoreInMemory called")
    setAuthState((oldState) => {return { state: PasswordStoreState.NewStoreInMemory, data: new Array<Containable> }});
  }

  const updateContainable = (callback: (value: Array<Containable>) => Array<Containable>)  => {
    const res = callback(authState.data);
    setAuthState((oldState) => {return {...oldState, data: res}});
  }
  
  return { authState, reset, initializeNewStoreInMemory, updateContainable };
}

const App: React.FC = () => {
  
  const {authState, initializeNewStoreInMemory} = usePasswordStoreState();

  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#">
            Key-<BiSolidShield/>-Rama
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="statusContainer">
        <Alert transition={false} show={authState.state === PasswordStoreState.Initial} variant="success">
          <Alert.Heading>Welcome to Key-<BiShield/>-Rama</Alert.Heading>
          <p>
          Offline Simple, Encrypted and Open source password manager. <br/> 
          </p>
          <hr />
          <Stack className="d-flex justify-content-end" direction="horizontal" gap={3}>
            <Button onClick={initializeNewStoreInMemory} variant="outline-success">
              Load Existing
            </Button>
            <div className="vr" />
            <Button onClick={initializeNewStoreInMemory} variant="success">
              Get Started
            </Button>
          </Stack>
          <div className="d-flex justify-content-end">
          </div>
        </Alert>
        <Alert show={authState.state === PasswordStoreState.NewStoreInMemory} variant="primary">
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
            <Button onClick={initializeNewStoreInMemory} variant="primary">
              Export
            </Button>
          </Stack>
          <div className="d-flex justify-content-end">
          </div>
        </Alert>
      </Container>
      <Container className="mainContainer">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Card>
                <Card.Body>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Credentials</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Notes</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Stack className="controlArea d-flex justify-content-end" direction="horizontal" gap={3}>
                    <div className="input-group w-auto">
                      <Form.Control
                        type="text"
                        placeholder="Group Name"
                      />
                    </div>
                    <Button variant="outline-primary">
                      Add
                    </Button>
                    <Button variant="outline-danger">
                      Remove
                    </Button>
                  </Stack>
                </Card.Body>
              </Card>
              <br />
              <Card>
                <Card.Body>
                  <Form>
                    {/* <Form.Group className="mb-3" controlId="formGroupEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group> */}
                    {/* <Stack className="controlArea d-flex justify-content-end" direction="horizontal" gap={3}>
                      <div className="input-group w-auto">
                        <Form.Control
                          type="text"
                          placeholder="Other Information"
                        />
                      </div>
                      <Button variant="outline-primary">
                        <BiPlus size={25}/>
                      </Button>
                    </Stack> */}
                    {/* <hr /> */}

                    <Stack className="d-flex" direction="vertical" gap={3}>
                      <Button variant="outline-primary">
                        Add Entry
                      </Button>
                    </Stack>
                  </Form>




                  
                  
                </Card.Body>
              </Card>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  
                </Tab.Pane>
                <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

    </>
  );
};
export default App;

// const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  
  // <ConfigProvider theme={themeConfig}>
  //   <Layout className="site-layout">
  //     <Header >
  //       <Title style={{ textAlign: 'center' }} level={3}>Yet Another <LockOutlined />assword Manager</Title>
  //     </Header>
  //     <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
  //       <>
  //       </>
  //     </Content>
  //     <Footer style={{ textAlign: 'center' }}>meetesh06.github.io</Footer>
  //   </Layout>
  // </ConfigProvider>
  
  {/* <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
  {
                !loaded &&
                <div>
                  <Button onClick={() => setLoaded(true)} type="primary" shape="default" icon={<PlusCircleFilled />} size={10}>
                    Create
                  </Button>
                  <Divider type="vertical" />
                  <Space>
                    <Upload beforeUpload={()=> false} maxCount={1} onChange={handleFileChange}>
                      <Button icon={<UploadOutlined />}>Load</Button>
                    </Upload>
                  </Space>
                </div>
              }
              {
                tempLoaded !== "" && <div>
                  <Divider/>
                  <Space>
                    <Input.Password prefix={<LockOutlined />} autoFocus placeholder='Unlock Password' onChange={(e) => setMaster(e.target.value)} value={master}/>
                    <Divider type='vertical' />
                    <Button onClick={handleUnlock} danger={unlockError} disabled={!unlockReady} type="primary" shape="default" icon={<LockOutlined />}>
                      Unlock
                    </Button>
                  </Space>
                </div>
              }
              {
                loaded && <div
                >
                  <Space>
                    <Input.Password prefix={<LockOutlined />} autoFocus placeholder='Master Password' onChange={(e) => setMaster(e.target.value)} value={master}/>
                  </Space>
                  <Divider type='vertical' />
                  <Button onClick={handleExport} disabled={!exportReady} type="primary" shape="default" icon={<SaveFilled />}>
                    Export
                  </Button>
                  </div>
              }
              
              {
                loaded && <div>
                  <Divider> 
                    {
                      copiedError ? <Typography> Copying to clipboard failed! </Typography> : ""
                    }
                  </Divider>
                  <Space direction='vertical'>
                    {
                      passwords.map((ele, index) => 
                          <Card key={`key-${index}`}
                            title={ele[0]}>
                            <Space direction='vertical'>
                              <Space direction='horizontal'>
                                <Input.Password prefix={<UserOutlined />} value={ele[1]}/>
                                <Button onClick={() => copyToClipboard(ele[1])}>Copy</Button>
                                <Button onClick={() => displayQR(ele[1])}><QrcodeOutlined/></Button>
                              </Space>
                              {
                                ele[2] !== "" && 
                                <Space direction='horizontal'>
                                  <Input.Password value={ele[2]}/>
                                  <Button onClick={() => copyToClipboard(ele[2])}>Copy</Button>
                                  <Button onClick={() => displayQR(ele[2])}><QrcodeOutlined/></Button>
                                </Space>
                              }
                              <Space direction='horizontal'>
                                <Input.Password prefix={<LockOutlined />} value={ele[3]}/>
                                <Button onClick={() => copyToClipboard(ele[3])}>Copy</Button>
                                <Button onClick={() => displayQR(ele[3])}><QrcodeOutlined/></Button>

                              </Space>
                              <Button onClick={() => setPasswords(passwords.filter((data, idx) => idx !== index ))}>Delete</Button>
                              {tempQR !== "" && 
                                <QRCode value={tempQR} />
                              }
                            </Space>
                          </Card>
                      )
                    }
                  </Space>
                  </div>
              }
              {
                loaded && <div>
                    <Divider> Add </Divider>
                    <Space>
                      <Card title="Add New Credential">
                        <Space direction='vertical'>
                          <Input placeholder='Google' onChange={(e) => { generateSecurePassword(); setToAddName(e.target.value)}} value={toAddName}/>
                          <Input placeholder='johndoe@email.com' onChange={(e) => { generateSecurePassword(); setToAddEmail(e.target.value); }} value={toAddEmail}/>
                          <Input placeholder='Misc' onChange={(e) => { generateSecurePassword(); setToAddOther(e.target.value); }} value={toAddOther}/>
                          <Input placeholder='Password' onChange={(e) => setToAddPassword(e.target.value)} value={toAddPassword}/>
                          <Slider
                            min={5}
                            max={20}
                            onChange={(v) => { generateSecurePassword(); setToAddLength(v)}}
                            value={toAddLength}
                          />
                          <Button onClick={addCredential} disabled={!toAddReady} type="primary" shape="default" icon={<SaveFilled />} size={10}>
                            Add
                          </Button>
                        </Space>
                      </Card>
                    </Space>
                    <Space>
                    </Space>
                  </div>
              }
            </div> */}

  // function generateSecurePassword() {
  //   const length = toAddLength
  //   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';
  
  //   if (length < 1 || typeof length !== 'number') {
  //     throw new Error('Invalid password length. Length must be a positive number.');
  //   }
  
  //   let password = '';
  //   const crypto = window.crypto || window.msCrypto;
  //   if (crypto && crypto.getRandomValues) {
  //     const values = new Uint32Array(length);
  //     crypto.getRandomValues(values);
  
  //     for (let i = 0; i < length; i++) {
  //       password += charset[values[i] % charset.length];
  //     }
  //   } else {
  //     // Fallback to Math.random()
  //     for (let i = 0; i < length; i++) {
  //       password += charset.charAt(Math.floor(Math.random() * charset.length));
  //     }
  //   }

  //   setToAddPassword(password)
  // }

  // const copyToClipboard = (text:string) => {
  //   navigator.clipboard.writeText(text)
  //       .then(() => {
  //       })
  //       .catch((error) => {
  //         setCopiedError(true);
  //       });
  // }

  // async function encryptTextWithPassword(text:string, password:string) {
  //   const encoder = new TextEncoder();
  //   const data = encoder.encode(text);
  
  //   const passwordEncoder = new TextEncoder();
  //   const passwordData = passwordEncoder.encode(password);
  
  //   const cryptoKey = await window.crypto.subtle.importKey(
  //     'raw',
  //     passwordData,
  //     'PBKDF2',
  //     false,
  //     ['deriveKey']
  //   );
  
  //   const salt = window.crypto.getRandomValues(new Uint8Array(16));
  //   const iterations = 100000;
  //   const derivedKey = await window.crypto.subtle.deriveKey(
  //     {
  //       name: 'PBKDF2',
  //       salt: salt,
  //       iterations: iterations,
  //       hash: 'SHA-256'
  //     },
  //     cryptoKey,
  //     { name: 'AES-GCM', length: 256 },
  //     false,
  //     ['encrypt']
  //   );
  
  //   const iv = window.crypto.getRandomValues(new Uint8Array(12));
  //   const encryptedData = await window.crypto.subtle.encrypt(
  //     {
  //       name: 'AES-GCM',
  //       iv: iv
  //     },
  //     derivedKey,
  //     data
  //   );
  
  //   const encryptedArray = new Uint8Array(encryptedData);
  //   const result = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  //   result.set(salt, 0);
  //   result.set(iv, salt.length);
  //   result.set(encryptedArray, salt.length + iv.length);
  
  //   const encryptedText = Array.from(result, byte => String.fromCharCode(byte)).join('');
  //   return btoa(encryptedText);
  // }

  // async function decryptTextWithPassword(encryptedText, password) {
  //   const decoder = new TextDecoder();
  //   const encryptedData = Uint8Array.from(atob(encryptedText), byte => byte.charCodeAt(0));
  
  //   const salt = encryptedData.slice(0, 16);
  //   const iv = encryptedData.slice(16, 28);
  //   const ciphertext = encryptedData.slice(28);
  
  //   const passwordEncoder = new TextEncoder();
  //   const passwordData = passwordEncoder.encode(password);
  
  //   const cryptoKey = await window.crypto.subtle.importKey(
  //     'raw',
  //     passwordData,
  //     'PBKDF2',
  //     false,
  //     ['deriveKey']
  //   );
  
  //   const derivedKey = await window.crypto.subtle.deriveKey(
  //     {
  //       name: 'PBKDF2',
  //       salt: salt,
  //       iterations: 100000,
  //       hash: 'SHA-256'
  //     },
  //     cryptoKey,
  //     { name: 'AES-GCM', length: 256 },
  //     false,
  //     ['decrypt']
  //   );
  
  //   const decryptedData = await window.crypto.subtle.decrypt(
  //     {
  //       name: 'AES-GCM',
  //       iv: iv
  //     },
  //     derivedKey,
  //     ciphertext
  //   );
  
  //   const decryptedText = decoder.decode(decryptedData);
  //   return decryptedText;
  // }

  // const handleExport = async () => {

  //   encryptTextWithPassword(JSON.stringify(passwords), master)
  //   .then(encryptedText => {
  //     console.log('Encrypted Text:', encryptedText);
  //     const element = document.createElement('a');
  //     const file = new Blob([encryptedText], { type: 'text/plain' });
  //     element.href = URL.createObjectURL(file);
  //     element.download = "op.pass";
  //     document.body.appendChild(element);
  //     element.click();
  //     document.body.removeChild(element);
  //   })
  //   .catch(error => {
  //     console.error('Encryption error:', error);
  //   });

  // };

  // const handleFileChange = (event:any) => {
  //   if (event.fileList.length <= 0) return setTempLoaded("");
  //   const file = event.fileList[0].originFileObj;
  //   const reader = new FileReader();
    

  //   reader.onload = (event) => {
  //     const contents = event.target.result;
  //     setTempLoaded(contents);
  //   };

  //   reader.readAsText(file);
  // };

  // const handleUnlock = () => {
  //   decryptTextWithPassword(tempLoaded, master)
  //     .then(decryptedText => {
  //       try {
  //         const passwords = JSON.parse(decryptedText);
  //         setPasswords(passwords)
  //         setMaster("");
  //         setTempLoaded("");
  //         setLoaded(true);
  //       } catch(e) {
  //         setMaster("");
  //         setUnlockError(true);
  //         // console.log('Decryption error, wrong password');
  //       }
  //     })
  //     .catch(error => {
  //       setMaster("");
  //       setUnlockError(true);
  //       // console.error('Decryption error:', error);
  //     });


  // }

  // const displayQR = (text) => {
  //   setTempQR(text)
  //   setTimeout(() => setTempQR(""), 5000);
  // }