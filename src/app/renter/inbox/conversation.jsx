import { useEffect } from "react";

export default function Conversation({ conversation, currentUser }) {
  useEffect(() => {
    const friendId = conversation.member.find((m) => m !== currentUser._id);
  });
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}
