import React, { useEffect, useState, useMemo } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { useGlobaldata } from '../../contexts/masterData/DataContext';
import Divider from "@mui/material/Divider";
import "../../assets/css/profilePicture.scss";

import {
  Avatar,
  Box,
  Typography,
} from "@mui/material";

interface IUserProfilePhotoProps {
  open: boolean;
}

const AVATAR_COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#9c27b0",
  "#d32f2f",
];

const getAvatarColor = (name = "") =>
  AVATAR_COLORS[name.length % AVATAR_COLORS.length];


const dividerStyle = {
  borderColor: "dimgray",
  marginTop: "24px",
  marginLeft: "10px",
};

const USER_PHOTO_URL = "https://graph.microsoft.com/v1.0/me/photo/$value";

const getInitials = (name: string): string => {
  const trimmedName = name.trim();

  if (!trimmedName) return "";

  // Handle format: "LastName, FirstName MiddleName"
  if (trimmedName.includes(",")) {
    const [lastName, firstPart] = trimmedName
      .split(",")
      .map((part) => part.trim());

    const firstName = firstPart?.split(/\s+/)[0];

    return `${lastName?.[0] ?? ""}${firstName?.[0] ?? ""}`.toUpperCase();
  }

  // Handle format: "FirstName MiddleName LastName"
  const parts = trimmedName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const UserProfilePhoto: React.FC<IUserProfilePhotoProps> = ({ open }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const { loggedInUser } = useGlobaldata();
  const token = loggedInUser?.accessToken || "";
const cleanedToken = useMemo(
  () => token.replace(/(?:^"|"$)/g, ""),
  [token]
);


const displayName = useMemo(() => {
  const rawName = loggedInUser?.displayName ?? "";

  const bracketIndex = rawName.indexOf("[");

  const cleanedName =
    bracketIndex >= 0
      ? rawName.slice(0, bracketIndex).trim()
      : rawName.trim();

  if (cleanedName.includes(",")) {
    const [lastName, remainingName] = cleanedName
      .split(",")
      .map((part) => part.trim());

    const nameParts = remainingName.split(" ").filter(Boolean);

    if (nameParts.length > 1) {
      return `${lastName}, ${nameParts[0]}...`;
    }

    return `${lastName}, ${nameParts[0] ?? ""}`;
  }

  return cleanedName;
}, [loggedInUser?.displayName]);

  const avatarColor = useMemo(
    () => getAvatarColor(displayName),
    [displayName]
  );

  useEffect(() => {
    if (!cleanedToken) return;

    const controller = new AbortController();
    let objectUrl: string | null = null;

    const fetchUserPhoto = async () => {
      try {
        const response = await fetch(USER_PHOTO_URL, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        });

        if (!response.ok) {
          setPhotoUrl(null);
          return;
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPhotoUrl(objectUrl);
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error("Error fetching user photo:", error);
        }
      }
    };

    fetchUserPhoto();

    return () => {
      controller.abort();

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [cleanedToken]);

  const initials = useMemo(
    () => getInitials(displayName || ""),
    [displayName]
  );

  return (
    <>
      <Divider
        sx={{
          ...dividerStyle,
          width: open ? "85%" : "70%",
        }}
      />
      <Box
        sx={{
          bgcolor: "#111",
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          p: 1,
          borderRadius: 1,
        }}
      >

        <Box>
          <Box className="photoContainer">
            <Box className="avatarCss">
              <Avatar
                aria-label={`Profile picture of ${displayName}`}
                src={photoUrl}
                alt={displayName || "User"}
                sx={{
                  width: 40,
                  height: 40,
                  fontWeight: 600,
                  lineHeight: 1.1,
                  bgcolor: avatarColor
                }}
              >
                {displayName ? initials : <PersonIcon />}
              </Avatar>
            </Box>
            <Box className="nameCss">
              <Typography
                component="span"
                sx={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 600,
                  lineHeight: 2.5,
                  marginLeft: "0.5rem"
                }}
              >
                {open ? displayName : null}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );

}
export default UserProfilePhoto