
import Badge from '../common/Badge';

export default function AvailabilityBadge({ available = true }) {
  return <Badge variant={available ? 'success' : 'danger'}>{available ? 'Available' : 'Sold Out'}</Badge>;
}
