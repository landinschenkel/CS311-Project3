import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import CharacterCard from './CharacterCard.jsx';
import './CharacterRegistry.css';

const API_URL = 'https://api.api-onepiece.com/v2/characters/en';
const CHARACTERS_TO_SHOW = 20;
const STRAW_HAT_CREW_ID = 1;

function CharacterRegistry() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStrawHats, setShowStrawHats] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [searchFailed, setSearchFailed] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    // Ignore a response if this component is removed before it arrives.
    let ignoreRequest = false;

    async function loadCharacters() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('The character request failed.');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('The character list was not in the expected format.');
        }

        if (!ignoreRequest) {
          setCharacters(data);
        }
      } catch {
        if (!ignoreRequest) {
          setError('Could not load characters. Please try again.');
        }
      } finally {
        if (!ignoreRequest) {
          setLoading(false);
        }
      }
    }

    // Load the full roster when this component first appears.
    loadCharacters();

    return () => {
      ignoreRequest = true;
    };
  }, []);

  async function searchCharacters(event) {
    event.preventDefault();
    const name = searchText.trim();

    if (name === '') {
      setSearchResults([]);
      setSearchMessage('Enter a character name to search.');
      setSearchFailed(false);
      return;
    }

    setSearching(true);
    setSearchResults(null);
    setSearchMessage('');
    setSearchFailed(false);

    try {
      // This makes a new API request instead of searching only the visible cards.
      const response = await fetch(
        `${API_URL}/search?name=${encodeURIComponent(name)}`,
      );
      if (!response.ok) {
        throw new Error('The character search failed.');
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('The search result was not in the expected format.');
      }

      setSearchResults(data);
      if (data.length === 0) {
        setSearchMessage(`No character found for "${name}".`);
      }
    } catch {
      setSearchResults([]);
      setSearchMessage('Could not search right now. Please try again.');
      setSearchFailed(true);
    } finally {
      setSearching(false);
    }
  }

  let filteredCharacters = characters;
  if (showStrawHats) {
    filteredCharacters = characters.filter(
      (character) =>
        character.crew &&
        Number(character.crew.id) === STRAW_HAT_CREW_ID,
    );
  }

  // The page number decides which 20 characters to show.
  const firstCharacterIndex = currentPage * CHARACTERS_TO_SHOW;
  const visibleCharacters = filteredCharacters.slice(
    firstCharacterIndex,
    firstCharacterIndex + CHARACTERS_TO_SHOW,
  );
  const totalPages = Math.ceil(
    filteredCharacters.length / CHARACTERS_TO_SHOW,
  );
  const firstCharacterNumber =
    visibleCharacters.length === 0 ? 0 : firstCharacterIndex + 1;
  const lastCharacterNumber = firstCharacterIndex + visibleCharacters.length;

  function renderCharacterCards(items) {
    return (
      <Row xs={1} md={2} xl={3} className="g-3">
        {items.map((character) => (
          <Col key={character.id}>
            <CharacterCard character={character} />
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <section className="registry" aria-labelledby="roster-heading">
      <div className="registry__tools d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
        <h2 id="roster-heading" className="h3 mb-0">
          Character list
        </h2>

        <Form className="registry-search" onSubmit={searchCharacters}>
          <Form.Label htmlFor="character-search">
            Search for a character
          </Form.Label>
          <InputGroup>
            <Form.Control
              id="character-search"
              type="search"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setSearchResults(null);
                setSearchMessage('');
                setSearchFailed(false);
              }}
              placeholder="Try Monkey D Luffy"
              readOnly={searching}
              aria-busy={searching}
            />
            <Button type="submit" variant="primary" disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </InputGroup>
        </Form>
      </div>

      {searchResults !== null && (
        <section
          className="search-results mb-4 pb-4 border-bottom"
          aria-labelledby="search-heading"
        >
          <h2 id="search-heading" className="h4 mb-3">
            Search results
          </h2>
          {searchResults.length > 0 ? (
            renderCharacterCards(searchResults)
          ) : (
            <Alert
              variant={searchFailed ? 'danger' : 'secondary'}
              role={searchFailed ? 'alert' : 'status'}
              className="mb-0"
            >
              {searchMessage}
            </Alert>
          )}
        </section>
      )}

      <div className="roster-toolbar d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        <ButtonGroup aria-label="Filter character list">
          <Button
            type="button"
            variant={showStrawHats ? 'outline-primary' : 'primary'}
            onClick={() => {
              setShowStrawHats(false);
              setCurrentPage(0);
            }}
          >
            All characters
          </Button>
          <Button
            type="button"
            variant={showStrawHats ? 'primary' : 'outline-primary'}
            onClick={() => {
              setShowStrawHats(true);
              setCurrentPage(0);
            }}
          >
            Straw Hat crew
          </Button>
        </ButtonGroup>
        {!loading && !error && (
          <p className="text-secondary mb-0" aria-live="polite">
            Showing {firstCharacterNumber}-{lastCharacterNumber} of{' '}
            {filteredCharacters.length} characters
          </p>
        )}
      </div>

      {loading && (
        <Alert variant="info" className="d-flex align-items-center">
          <Spinner
            animation="border"
            size="sm"
            role="status"
            className="me-2"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          Loading characters...
        </Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && visibleCharacters.length === 0 && (
        <Alert variant="warning">No characters found for this filter.</Alert>
      )}

      {!loading && !error && visibleCharacters.length > 0 && (
        renderCharacterCards(visibleCharacters)
      )}

      {!loading && !error && totalPages > 1 && (
        <nav
          className="pagination-controls d-flex align-items-center justify-content-center gap-3 mt-4"
          aria-label="Character pages"
        >
          <Button
            variant="outline-primary"
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </Button>
          <span className="text-secondary">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline-primary"
            type="button"
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </Button>
        </nav>
      )}
    </section>
  );
}

export default CharacterRegistry;
