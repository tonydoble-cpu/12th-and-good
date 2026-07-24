import WaitingRoom from "@/components/WaitingRoom";

export default function WaitingRoomPage() {
  // In production, these would come from the booking record via
  // searchParams or a server-side lookup. For now, demo defaults.
  return (
    <WaitingRoom
      coachName="Tony"
      coachTitle="Financial Wellness Coach"
    />
  );
}
