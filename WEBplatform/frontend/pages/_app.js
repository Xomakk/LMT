import Layout from '@/components/Layout';
import '@/styles/globals.scss'
import { SSRProvider } from 'react-bootstrap';

const App = ({ Component, pageProps }) => (
  <SSRProvider>
    <Layout>
        <Component {...pageProps} />
    </Layout>
  </SSRProvider>
);

export default App;