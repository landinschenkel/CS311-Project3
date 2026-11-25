import { Badge, Card } from 'react-bootstrap';

function RegistryHeader() {
  return (
    <Card as="header" className="site-header text-bg-dark border-0 shadow-sm mb-4">
      <Card.Body className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 p-4 p-md-5">
        <div>
          <Badge bg="warning" text="dark" className="mb-3">
            One Piece roster project
          </Badge>
          <Card.Title as="h1" className="display-5 fw-bold mb-3">
            One Piece characters
          </Card.Title>
          <Card.Text className="site-header__description mb-0">
            Look through characters from the One Piece API. Use the filters or
            search by name to find someone.
          </Card.Text>
        </div>
        <div
          className="site-header__seal"
          role="img"
          aria-label="Pirate roster sticker"
        >
          PIRATE
          <br />
          LIST
        </div>
      </Card.Body>
    </Card>
  );
}

export default RegistryHeader;
