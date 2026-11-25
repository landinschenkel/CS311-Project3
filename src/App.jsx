import { Container } from 'react-bootstrap';
import CharacterRegistry from './components/CharacterRegistry.jsx';
import RegistryHeader from './components/RegistryHeader.jsx';

function App() {
  return (
    <Container as="main" className="app-shell py-4 py-lg-5">
      <RegistryHeader />
      <CharacterRegistry />
    </Container>
  );
}

export default App;
