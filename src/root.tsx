// @refresh reload
import { Body, ErrorBoundary, Head, Html, Meta, Scripts, Title } from 'solid-start';
import Editor from './components/Editor';
import Palette from './components/Palette';
import './root.css';

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SiliWiz Demo</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <ErrorBoundary>
          <h1>Siliwiz</h1>
          <Palette />
          <Editor />
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
