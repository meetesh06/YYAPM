'use client';

import React, { useEffect, useState } from 'react';

import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonGroup, Card, Col, Container, Form, Nav, Navbar, Row, Spinner, Stack, Tab } from 'react-bootstrap';

import { BiSolidShield } from 'react-icons/bi';
import { useGenericStatefulData } from './hooks/GenericStatefulData';
// import { assert } from 'console';
import WelcomeAlert from './components/WelcomeAlert';
import LoadedAlert from './components/LoadedAlert';
import UnlockAlert from './components/UnlockAlert';
import AddGroupModal from './components/AddGroupModal';
import RemoveGroupModal from './components/RemoveGroupModal';
import AddNoteModal from './components/AddNoteModal';
import AddCredentialModal from './components/AddCredentialModal';

import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";

import NoteCard from './components/NoteCard';
import CredCard from './components/CredCard';

enum ProgStates {
  Initial,
  LockedData,
  Saved,
  Unsaved
};

type Note = {
  tag: string,
  date: Date,
  title: string,
  note: string
}

type CredData = {
  key: string,
  value: string
}

type Credential = {
  tag: string,
  date: Date,
  title: string,
  kvp: Array<CredData>
}


type DataMap = {
  groupName: string,
  store: Array<Note | Credential>
}


const App: React.FC = () => {
  const { m_state, m_initializeState, m_transitionHandler } = useGenericStatefulData<Array<DataMap> | string | undefined,ProgStates>();

  const [addGroupModal, setAddGroupModal] = useState(false);
  const [deleteGroupModal, setDeleteGroupModal] = useState(false);
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [addCredentialModal, setAddCredentialModal] = useState(false);

  const [activeTab, setActiveTab] = useState("");

  const changeActiveTab = (next: any) => {
    setActiveTab(() => next);
  }


  // Initialize program state upon load
  useEffect(() => {
    m_initializeState((data) => {
      return { state: ProgStates.Initial, data: undefined }
    })
  }, []);

  // Transition: create new store in memory
  const t_createNew = () => {
    const data = new Array<DataMap>()
    data.push(
      {
        groupName: "General",
        store: [
          { 
            tag: "note", 
            date: new Date(), 
            title: "Laundry Related Note",
            note: `
            Polyfill of Array.prototype.findIndex in core-js
            Indexed collections
            Array
            Array.prototype.find()
            Array.prototype.findLast()
            Array.prototype.findLastIndex()
            Array.prototype.indexOf()
            Array.prototype.lastIndexOf()
            TypedArray.prototype.findIndex()
        `, 
          } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...This is a test here is a test...", 
          //   title: "Research Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...This is a test here is a test...This is a test here is a test...This is a test here is a test...", 
          //   title: "Stuff Research Banana Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...", 
          //   title: "Laundry Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...This is a test here is a test... This is a test here is a test...This is a test here is a test... This is a test here is a test...This is a test here is a test...", 
          //   title: "Research  This is a test here is a test...This is a test here is a test...Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...This is a test here is a test...This is a test here is a test...This is a test here is a test...", 
          //   title: "Stuff Research Banana Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...", 
          //   title: "Laundry Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...This is a test here is a test...", 
          //   title: "Research Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...This is a test here is a test...This is a test here is a test...This is a test here is a test...", 
          //   title: "Stuff Research Banana Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...", 
          //   title: "Laundry Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...This is a test here is a test...", 
          //   title: "Research Related Note" 
          // } as Note, 
          // { 
          //   tag: "note", 
          //   date: new Date(), 
          //   note: "This is a test here is a test...This is a test here is a test...This is a test here is a test...This is a test here is a test...", 
          //   title: "Stuff Research Banana Related Note" 
          // } as Note, 
        
        ]
      }
    );
    m_transitionHandler(
      (s) => {
        return;
      },
      (s) => {
        return { state: ProgStates.Unsaved, data};
      },
      (s) => {
        return;
      }
    )

    setActiveTab(data[0].groupName);
  }

  const t_loadExisting = (rawData: string) => {
    m_transitionHandler(
      (s) => {
        return;
      },
      (s) => {
        return { state: ProgStates.LockedData, data: rawData };
      },
      (s) => {
        return;
      }
    )
  }

  const t_initiateSave = () => {

  }

  const t_reset = () => {
    m_initializeState((data) => {
      return { state: ProgStates.Initial, data: undefined }
    })
  }

  const t_unlock = (data: any) => {
    m_transitionHandler(
      (s) => {
        return;
      },
      (s) => {
        return { state: ProgStates.Saved, data };
      },
      (s) => {
        return;
      }
    )
  }

  const t_addgroup = (newGroupName: string) => {
    m_transitionHandler(
      (s) => {
        console.log("pre", s)
        return;
      },
      (s) => {
        if (typeof(s.data) === "object") {
          if (s.data.findIndex((v) => v.groupName === newGroupName) !== -1) {
            return s;
          }
          const newState = {
            state: s.state,
            data: [...s.data, {
              groupName: newGroupName,
              store: new Array<Note | Credential>()
            }] 
          }
          if (newState.data.length === 1) {
            setActiveTab(newGroupName)
          }
          return newState;

        }
        return s;
      },
      (s) => {
        console.log("post", s)
        return;
      }
    )
  }

  const t_removegroup = () => {
    m_transitionHandler(
      (s) => {
        return;
      },
      (s) => {
        if (typeof(s.data) === "object") {
          let removedIndex = undefined
          let filteredData = s.data.filter((data, idx, arr) => {
              if (data.groupName === activeTab) removedIndex = idx
              return data.groupName != activeTab
            });
          const res = {
            state: ProgStates.Unsaved,
            data: filteredData
          }
          
          // CODE IS BUGGY, its easy to reach buggy states when people write code
          // intent is far away from reality "typeof(removedIndex) === 'number'"
          if (typeof(removedIndex) === 'number' && res.data[removedIndex]) {
            let fallbackTab = res.data[removedIndex].groupName;
            setActiveTab(fallbackTab)
          } else {
            setActiveTab("")
          }
          return res;
        }
        return s;
      },
      (s) => {
        return;
      }
    )
    
  }

  const t_addNote = (currNote: Note) => {
    m_transitionHandler(
      (s) => {
        return;
      },
      (s) => {
        if (typeof(s.data) === "object") {
          const newState = {...s};
          let idx = s.data.findIndex((element) => element.groupName === activeTab);
          if (newState.data && newState.data[idx]) {
            let currentGroup: DataMap = newState.data[idx] as DataMap
            currentGroup.store.push(currNote)
            return newState
          } else {
            return s;
          }
        }
        return s;
      },
      (s) => {
        return;
      }
    )
  }

  const t_addCredential = (currCred: Credential) => {
    m_transitionHandler(
      (s) => {
        return;
      },
      (s) => {
        if (typeof(s.data) === "object") {
          const newState = {...s};
          let idx = s.data.findIndex((element) => element.groupName === activeTab);
          if (newState.data && newState.data[idx]) {
            let currentGroup: DataMap = newState.data[idx] as DataMap
            currentGroup.store.push(currCred)
            return newState
          } else {
            return s;
          }
        }
        return s;
      },
      (s) => {
        return;
      }
    )
  }

  const handleGroupModalOpen = () => {
    setAddGroupModal(true);
  }
  
  const handleGroupModalClose = () => {
    setAddGroupModal(false);
  }

  const handleDeleteGroupModalOpen = () => {
    setDeleteGroupModal(true);
  }
  
  const handleDeleteGroupModalClose = () => {
    setDeleteGroupModal(false);
  }

  const handleAddNoteModalOpen = () => {
    setAddNoteModal(true);
  }
  
  const handleAddNoteModalClose = () => {
    setAddNoteModal(false);
  }

  const handleAddCredentialModalOpen = () => {
    setAddCredentialModal(true);
  }
  
  const handleAddCredentialModalClose = () => {
    setAddCredentialModal(false);
  }
  

  
  const interactionEnabled : boolean = m_state.state && m_state.state > ProgStates.LockedData && activeTab !== "" ? true : false;

  const noGroupSelected : boolean = m_state.state && m_state.state > ProgStates.LockedData ? true : false;
  return (
    <div>
      <AddGroupModal show={addGroupModal} transition={t_addgroup} close={handleGroupModalClose}/>
      <RemoveGroupModal show={deleteGroupModal} current={activeTab ? activeTab : ""} transition={t_removegroup} close={handleDeleteGroupModalClose}/>
      <AddNoteModal show={addNoteModal} transition={t_addNote} close={handleAddNoteModalClose}/>
      <AddCredentialModal show={addCredentialModal} transition={t_addCredential} close={handleAddCredentialModalClose}/>
      
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#" onClick={t_reset}>
            Key-<BiSolidShield/>-Rama
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="statusContainer">
        {
          m_state.state === undefined &&
          <div className='spinnercontainer'>
            <Spinner animation="border" />
          </div> 
        }
        <WelcomeAlert transition={false}
          show={m_state.state === ProgStates.Initial} 
          t_createNew={t_createNew} 
          t_loadExisting={t_loadExisting} 
        />
        <LoadedAlert
          transition={true} 
          show={(m_state.state && m_state.state > ProgStates.LockedData) ? true : false} 
          t_initiateSave={t_initiateSave} 
          t_reset={t_reset}
        />
        <UnlockAlert 
          transition={true} 
          show={m_state.state === ProgStates.LockedData} 
          rawData={(typeof(m_state.data) === "string" ? m_state.data : "")}
          t_unlock={t_unlock}
          t_reset={t_reset}
        />
      </Container>
      <Container className="mainContainer">
          <Row>

            <Col sm={12}>
              <Card>
                <Card.Header>
                  <Nav 
                    variant="tabs" 
                    activeKey={activeTab}
                    onSelect={changeActiveTab}
                  >
                    {
                      typeof(m_state.data) === "object" && m_state.data.map((value, index) => {
                        return (
                          <Nav.Item key={`tab-${value.groupName}`}>
                            <Nav.Link
                              eventKey={`${value.groupName}`}
                            >
                              {value.groupName}
                            </Nav.Link>
                          </Nav.Item>
                        )
                      })
                    }
                    <Button disabled={!noGroupSelected} variant="link" onClick={handleGroupModalOpen}>
                      Add Group
                    </Button>
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <div className='masonry-holder'>
                    <ButtonGroup aria-label="Add new">
                      <Button onClick={handleAddCredentialModalOpen} disabled={!interactionEnabled} variant="outline-primary">New Credential</Button>
                      <Button onClick={handleAddNoteModalOpen} disabled={!interactionEnabled} variant="outline-primary">New Note</Button>
                      <Button onClick={handleDeleteGroupModalOpen} disabled={!interactionEnabled} variant="outline-danger">Delete this group</Button>
                    </ButtonGroup>
                    <hr></hr>
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
                    >
                      <Masonry>
                        {
                          interactionEnabled && typeof(m_state.data) === "object" && m_state.data.filter((ele) => ele.groupName === activeTab)[0].store.map((value, index) => {
                            if (value.tag === "note") {
                              const currNote = value as Note
                              return (
                                <NoteCard key={`nav-entry-${index}`} title={currNote.title} note={currNote.note} date={currNote.date} />
                              )
                            } else {
                              const currCred = value as Credential
                              return <CredCard key={`nav-entry-${index}`} title={currCred.title} kvp={currCred.kvp} date={currCred.date}/>
                            }
                          })
                        } 
                      </Masonry>
                    </ResponsiveMasonry>
                  </div>
                </Card.Body>
              </Card>

            </Col>
          </Row>
      </Container>
        
    </div>
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