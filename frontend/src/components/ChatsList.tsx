import { useEffect } from "react";
import { useChatsStore } from "../store/useChatsStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getAllChats, allChats, isLoadingChats, setSelectedContact } = useChatsStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllChats();
  }, [getAllChats]);

  if (isLoadingChats) return <UsersLoadingSkeleton />;
  if (allChats.length === 0) return <NoChatsFound />;

  return (
    <>
      {allChats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedContact(chat.participants.find((user) => user._id !== useAuthStore.getState().user?._id) || null)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}
            >
              <div className="size-12 rounded-full">
                <img
                  src={chat.participants.find((user) => user._id !== useAuthStore.getState().user?._id)?.profilePic || "/avatar.png"}
                  alt={chat.participants.find((user) => user._id !== useAuthStore.getState().user?._id)?.name || "User avatar"}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {chat.participants.find((user) => user._id !== useAuthStore.getState().user?._id)?.name || "Unknown User"}
            </h4>
          </div>
        </div>
      ))}
    </>
  );

  return "chatlist";
}
export default ChatsList;
