
import Document, { Html, Head, Main, NextScript } from 'next/document';
export default class MyDocument extends Document {
  render(){return(<Html lang="en" data-bs-theme="dark"><Head><meta name="theme-color" content="#0c0f13"/><link rel="icon" href="/assets/logo.svg"/><meta name="description" content="Premium personal training and nutrition coaching."/></Head><body><Main/><NextScript/></body></Html>);}
}
