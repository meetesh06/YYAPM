import {useState} from 'react';


  
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
