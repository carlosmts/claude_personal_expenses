// Colored circle with a person's initial — the buildable stand-in for a
// photo avatar, since there's no photo-upload feature. Color is derived
// deterministically from the user's id so the same person always gets the
// same color across the app.
const PALETTE = ['#0f172a', '#475569', '#0f766e', '#7c3aed', '#b45309'];

interface InitialsAvatarProps {
  name: string;
  userId: number;
  size?: number;
}

export function InitialsAvatar({ name, userId, size = 40 }: InitialsAvatarProps) {
  const color = PALETTE[userId % PALETTE.length];
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
