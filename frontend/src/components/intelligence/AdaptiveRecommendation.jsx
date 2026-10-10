
import AdaptiveRecommendationCard from "./AdaptiveRecommendationCard";

export default function AdaptiveRecommendation({
  recommendation,
  onApprove,
  onReject,
  onModify,
  showActions = true,
}) {
  return (
    <AdaptiveRecommendationCard
      recommendation={recommendation}
      onApply={onApprove}
      onDismiss={onReject}
      onModify={onModify}
      showActions={showActions}
    />
  );
}
