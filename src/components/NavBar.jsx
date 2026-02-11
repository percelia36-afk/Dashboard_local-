"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const paths = [
  { name: "Stats", href: "/stats" },
];

  const pathname = usePathname();
  return (
    <nav className="w-64 h-screen bg-zinc-900 text-white flex flex-col border-r border-zinc-800">
      <div className="p-6 text-xl font-bold tracking-wide">
        Creator Dashboard
      </div>

      <ul className="flex flex-col gap-1 px-4">
        {paths.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded-md transition ${
                  active ? "bg-zinc-700" : "hover:bg-zinc-800"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="p-4 mt-auto flex flex-col gap-2">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

// ...existing code...
