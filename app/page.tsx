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

const exampleData = {
  groupName: "General",
  store: [
    {
      tag: "note",
      date: new Date(),
      title: "Random Coding Note",
      note: `Exploring different sorting algorithms Bubble Sort vs. Quick Sort vs. Merge Sort Pros and cons of each algorithm When to use which algorithm Importance of algorithmic efficiency` ,
    } as Note,
    {
      tag: "credential",
      date: new Date(),
      title: "Google",
      kvp: [
        { key: "username", value: "meetesh06" },
        { key: "password", value: "passw0rd" }
      ]
    } as Credential
  ]
}

async function encryptTextWithPassword(text:string, password:string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const passwordEncoder = new TextEncoder();
  const passwordData = passwordEncoder.encode(password);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100000;
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256'
    },
    cryptoKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    derivedKey,
    data
  );

  const encryptedArray = new Uint8Array(encryptedData);
  const result = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(encryptedArray, salt.length + iv.length);

  const encryptedText = Array.from(result, byte => String.fromCharCode(byte)).join('');

  const final = btoa(encryptedText)

  const element = document.createElement('a');
  const file = new Blob([final], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = "keyo.txt";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
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
      exampleData
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

  const t_initiateSave = (master: string) => {
    m_transitionHandler(
      (s) => {
        return;
      },
      (s) => {
        encryptTextWithPassword(JSON.stringify(s.data), master)
        return {...s, state: ProgStates.Saved};
      },
      (s) => {
        return;
      }
    )
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
        setActiveTab(data[0].groupName)
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
        return;
      },
      (s) => {
        if (typeof(s.data) === "object") {
          if (s.data.findIndex((v) => v.groupName === newGroupName) !== -1) {
            return s;
          }
          const newState = {
            state: ProgStates.Unsaved,
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
          } else if (res.data.length > 0){
            setActiveTab(res.data[0].groupName)
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

  const t_removeelement = (indexToRem: number) => {
    m_transitionHandler(
      (s) => {
        return;
      },
      (s) => {
        if (typeof(s.data) === "object") {
          let newData = s.data.map((ele, idx) => {
            if (ele.groupName === activeTab) {
              return {
                groupName: ele.groupName,
                store: ele.store.filter((ele, toRemIdx) => toRemIdx !== indexToRem)
              }
            } else {
              return ele;
            }
          });

          const newState = {
            state: ProgStates.Unsaved,
            data: newData 
          }
          return newState;
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
          const newState = {...s, state: ProgStates.Unsaved};
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
          const newState = {...s, state: ProgStates.Unsaved};
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

  const validProjectIsLoaded = m_state.state && m_state.state > ProgStates.LockedData


  
  const shouldShowAddGroupButton = validProjectIsLoaded
  const shouldAllowAdditionToAGroup = validProjectIsLoaded

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
        {/* When the state is undefined, show loading snipper */}
        {
          m_state.state === undefined &&
          <div className='spinnercontainer'>
            <Spinner animation="border" />
          </div> 
        }
        {/* When the state is Initial, show option to load a project or start a new one */}
        <WelcomeAlert 
          show={m_state.state === ProgStates.Initial} 
          transition={false}
          t_createNew={t_createNew} 
          t_loadExisting={t_loadExisting} 
        />
        {/* When the state is holding runtime data, show option to export/exit */}
        <LoadedAlert
          savedState={m_state.state && m_state.state > ProgStates.LockedData && m_state.state === ProgStates.Saved ? true : false }
          show={(m_state.state && m_state.state > ProgStates.LockedData) ? true : false} 
          transition={true} 
          t_initiateSave={t_initiateSave} 
          t_reset={t_reset}
        />
        {/* When the state is holding locked data, show option to unlock the stored file */}
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
                  {/* Render list of groups */}
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
                    {/* Option to add new group, only enabled if a project is actually loaded */}
                    <Button disabled={!shouldShowAddGroupButton} variant="link" onClick={handleGroupModalOpen}>
                      Add Group
                    </Button>
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <div className='masonry-holder'>
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
                    >
                      <Masonry>
                        {
                          shouldAllowAdditionToAGroup && typeof(m_state.data) === "object" && m_state.data.filter((ele) => ele.groupName === activeTab)[0].store.map((value, index) => {
                            if (value.tag === "note") {
                              const currNote = value as Note
                              return (
                                <NoteCard remove={() => t_removeelement(index)} key={`nav-entry-${index}`} title={currNote.title} note={currNote.note} date={currNote.date} />
                              )
                            } else if (value.tag === "credential") {
                              const currCred = value as Credential
                              return <CredCard remove={() => t_removeelement(index)} key={`nav-entry-${index}`} title={currCred.title} kvp={currCred.kvp} date={currCred.date}/>
                            } else {
                              return <div key={`nav-entry-${index}`}> { JSON.stringify(value) }</div>
                            }
                          })
                        }
                        {
                          shouldAllowAdditionToAGroup && typeof(m_state.data) === "object" && m_state.data.filter((ele) => ele.groupName === activeTab)[0].store.length === 0 && <div></div>
                        }
                      </Masonry>
                    </ResponsiveMasonry>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Stack direction='horizontal' style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <div className="me-auto" />
                    <ButtonGroup size='sm' aria-label="Add new">
                      <Button onClick={handleAddCredentialModalOpen} disabled={!shouldAllowAdditionToAGroup} variant="outline-primary">+ Cred</Button>
                      <Button onClick={handleAddNoteModalOpen} disabled={!shouldAllowAdditionToAGroup} variant="outline-primary">+ Note</Button>
                      <Button onClick={handleDeleteGroupModalOpen} disabled={!shouldAllowAdditionToAGroup} variant="danger">Delete <b>{activeTab}</b></Button>
                    </ButtonGroup>

                  </Stack>
                </Card.Footer>
              </Card>

            </Col>
          </Row>
      </Container>
        
    </div>
  );
};
export default App;