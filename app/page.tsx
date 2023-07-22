'use client';

import themeConfig from './theme/themeConfig';

import React, { useState } from 'react';
import {
  PlusCircleFilled,
  LockOutlined,
  UserOutlined,
  UploadOutlined,
  QrcodeOutlined,
  SaveFilled
} from '@ant-design/icons';
import { Button, Card, ConfigProvider, Divider, Input, Layout, Slider, Space, Typography, Upload, theme } from 'antd';
import Title from 'antd/es/typography/Title';
import QRCode from "react-qr-code";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loaded, setLoaded] = useState(false)
  const [master, setMaster] = useState("")
  const [passwords, setPasswords] = useState([])
  const [toAddName, setToAddName] = useState("")
  const [toAddEmail, setToAddEmail] = useState("")
  const [toAddOther, setToAddOther] = useState("")
  const [toAddLength, setToAddLength] = useState(14)
  const [toAddPassword, setToAddPassword] = useState("")
  const [copiedError, setCopiedError] = useState(false)
  const [tempLoaded, setTempLoaded] = useState("")
  const [tempQR, setTempQR] = useState("")
  const [unlockError, setUnlockError] = useState(false)

  const toAddReady = toAddName !== "" && toAddEmail !== ""
  const exportReady = master !== "" && passwords.length > 0

  const unlockReady = master !== ""


  const addCredential = () => {
    setPasswords([...passwords, [toAddName, toAddEmail, toAddOther, toAddPassword]])
    setToAddName("")
    setToAddEmail("")
    setToAddOther("")
    setToAddPassword("")
  }

  function generateSecurePassword() {
    const length = toAddLength
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';
  
    if (length < 1 || typeof length !== 'number') {
      throw new Error('Invalid password length. Length must be a positive number.');
    }
  
    let password = '';
    const crypto = window.crypto || window.msCrypto;
    if (crypto && crypto.getRandomValues) {
      const values = new Uint32Array(length);
      crypto.getRandomValues(values);
  
      for (let i = 0; i < length; i++) {
        password += charset[values[i] % charset.length];
      }
    } else {
      // Fallback to Math.random()
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }

    setToAddPassword(password)
  }

  const copyToClipboard = (text:string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
        })
        .catch((error) => {
          setCopiedError(true);
        });
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
    return btoa(encryptedText);
  }

  async function decryptTextWithPassword(encryptedText, password) {
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
  
  

  const handleExport = async () => {

    encryptTextWithPassword(JSON.stringify(passwords), master)
    .then(encryptedText => {
      console.log('Encrypted Text:', encryptedText);
      const element = document.createElement('a');
      const file = new Blob([encryptedText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "op.pass";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    })
    .catch(error => {
      console.error('Encryption error:', error);
    });

  };

  const handleFileChange = (event:any) => {
    if (event.fileList.length <= 0) return setTempLoaded("");
    const file = event.fileList[0].originFileObj;
    const reader = new FileReader();
    

    reader.onload = (event) => {
      const contents = event.target.result;
      setTempLoaded(contents);
    };

    reader.readAsText(file);
  };

  const handleUnlock = () => {
    decryptTextWithPassword(tempLoaded, master)
      .then(decryptedText => {
        try {
          const passwords = JSON.parse(decryptedText);
          setPasswords(passwords)
          setMaster("");
          setTempLoaded("");
          setLoaded(true);
        } catch(e) {
          setMaster("");
          setUnlockError(true);
          // console.log('Decryption error, wrong password');
        }
      })
      .catch(error => {
        setMaster("");
        setUnlockError(true);
        // console.error('Decryption error:', error);
      });


  }

  const displayQR = (text) => {
    setTempQR(text)
    setTimeout(() => setTempQR(""), 5000);
  }





  return (
    <ConfigProvider theme={themeConfig}>
        <Layout className="site-layout">
          <Header style={{ background: colorBgContainer }} >
            <Title style={{ textAlign: 'center' }} level={3}>Yet Another <LockOutlined />assword Manager</Title>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
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
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>meetesh06.github.io</Footer>
        </Layout>
    </ConfigProvider>
  );
};

export default App;
