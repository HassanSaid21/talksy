import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatsStore } from "../store/useChatsStore";
import toast from "react-hot-toast";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, user, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatsStore();
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/image\/(png|jpeg|webp|gif)/.test(file.type)) {
      toast.error("Choose a PNG, JPEG, WebP, or GIF image");
      e.target.value = "";
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      toast.error("Profile picture must be smaller than 2.5 MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    // Read the file as a data URL for preview and upload
    reader.readAsDataURL(file);
    // When the file is read, update the state with the data URL
    reader.onload = async () => {
      if (typeof reader.result !== "string") {
        toast.error("Could not read that image");
        return;
      }
      setIsUploading(true);
      try {
        await updateProfile({ profilePicUrl: reader.result });
      } catch (error) {
        console.error("Failed to update profile picture:", error);
        // The store displays the request error to the user.
        toast.error("Failed to update profile picture ");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    };

    reader.onerror = () => {
      toast.error("Could not read that image");
      e.target.value = "";
    };
  };

   return (
    <div className="p-6 border-b border-slate-700/50">
       <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
         {/* AVATAR */}
        <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs">Uploading...</span>
                </div>
              )}
              <img
                src={
                  user?.profilePicture || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">
                  {isUploading ? "Uploading" : "Change"}
                </span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
               onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-45 truncate">
              {user?.name}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
  return  'profile header'
}
export default ProfileHeader;
