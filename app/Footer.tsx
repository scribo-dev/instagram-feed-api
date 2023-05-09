import Link from "next/link";

export default function Footer() {
  return (
    <div className="fixed right-6 bottom-2 flex justify-end gap-2 text-xs dark:text-gray-50 rounded-xl shadow-md bg-blue-600 px-4 py-3">
      <Link href="https://scribo.dev" target="_blank">
        Made by <strong>Scribo.dev</strong>
      </Link>
      {/* <Link href="/terms">Terms of service</Link>
      <Link href="/privacy">Privacy</Link> */}
    </div>
  );
}
