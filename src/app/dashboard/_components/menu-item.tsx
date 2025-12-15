"use client";
import Link from "next/link";

type MenuItemProps = {
  href: string;
  children: React.ReactNode;
  defaultActive?: boolean;
};

export default function MenuItem({ href, children, defaultActive = false }: MenuItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    const menuContainer = (e.currentTarget as HTMLElement).closest('ul');
    if (!menuContainer) return;
    
    const menuItems = menuContainer.querySelectorAll('li');
    menuItems.forEach(item => item.classList.remove('active-list'));

    const liElement = (e.currentTarget as HTMLElement).closest('li');
    if (liElement) {
      liElement.classList.add('active-list');
    }
  };

  return (
    <li className={`list ${defaultActive ? 'active-list' : ''}`}>
      <Link 
        href={href} 
        className="flex items-center gap-4 p-4 w-full"
        onClick={handleClick}
      >
        {children}
      </Link>
    </li>
  );
}

