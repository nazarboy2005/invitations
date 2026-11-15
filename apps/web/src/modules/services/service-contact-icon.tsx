import { AtSign, Facebook, Globe, Instagram, Youtube } from "lucide-react";

/** Contact URLs have already passed serviceExternalUrl's protocol validation. */
export function ServiceContactIcon({ href }: { href: string }) {
  const host = new URL(href).hostname.replace(/^www\./, "");
  if (host === "instagram.com") return <Instagram size={19} />;
  if (host === "facebook.com" || host === "fb.com")
    return <Facebook size={19} />;
  if (host === "youtube.com" || host === "youtu.be")
    return <Youtube size={20} />;
  if (host === "threads.com" || host === "threads.net")
    return <AtSign size={19} />;
  if (host === "t.me" || host === "telegram.me")
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M21.4 3.6 18 20c-.3 1.2-1 1.5-2 .9l-5.2-3.8-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.3L17.4 6c.4-.4-.1-.6-.6-.3L4.7 13.3l-5-1.6c-1.1-.3-1.1-1.1.2-1.6L19.5 2.5c.9-.3 1.7.2 1.9 1.1Z"
          transform="translate(1 0) scale(.95 1)"
        />
      </svg>
    );
  return <Globe size={19} />;
}
