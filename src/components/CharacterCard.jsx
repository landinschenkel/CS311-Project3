import { Card } from 'react-bootstrap';

function CharacterCard({ character }) {
  let crewName = 'None listed';
  if (character.crew) {
    crewName = character.crew.name;
  }

  let fruitName = 'None listed';
  if (character.fruit) {
    fruitName = character.fruit.name;
  }

  return (
    <Card className="character-card h-100 shadow-sm">
      <Card.Body>
        <Card.Title as="h3" className="h5 mb-3">
          {character.name || 'Unknown character'}
        </Card.Title>
        <Card.Text>
          <strong>Role:</strong> {character.job || 'Unknown'}
        </Card.Text>
        <Card.Text>
          <strong>Bounty:</strong> {character.bounty ?? 'Unknown'}
        </Card.Text>
        <Card.Text>
          <strong>Crew:</strong> {crewName}
        </Card.Text>
        <Card.Text>
          <strong>Devil Fruit:</strong> {fruitName}
        </Card.Text>
        <Card.Text className="mb-0">
          <strong>Status:</strong> {character.status || 'Unknown'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CharacterCard;
