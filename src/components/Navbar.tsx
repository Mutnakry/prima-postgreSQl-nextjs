'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/brand', label: 'Brand' },
  { href: '/category', label: 'Category' },
  { href: '/login', label: 'Login' },
  { href: '/product', label: 'Product' },
  { href: '/register', label: 'Register' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 p-4 bg-gray-900 text-white">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`hover:underline ${pathname === href ? 'text-yellow-400 font-bold' : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
