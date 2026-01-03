"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSidebar } from "./sidebar-context";

type MenuItemProps = {
  href: string;
  children: React.ReactNode;
  defaultActive?: boolean;
};

export default function MenuItem({ href, children, defaultActive = false }: MenuItemProps) {
  const pathname = usePathname();
  const isActive = defaultActive || pathname === href || pathname.startsWith(href + '/');
  const { onClose } = useSidebar();

  const handleClick = (e: React.MouseEvent) => {
    const menuContainer = (e.currentTarget as HTMLElement).closest('ul');
    if (!menuContainer) return;
    
    const menuItems = menuContainer.querySelectorAll('li');
    menuItems.forEach(item => item.classList.remove('active-list'));

    const liElement = (e.currentTarget as HTMLElement).closest('li');
    if (liElement) {
      liElement.classList.add('active-list');
    }

    // Close sidebar on mobile when item is clicked
    onClose();
  };

  useEffect(() => {
    const menuContainer = document.getElementById('adminMenu');
    if (!menuContainer) return;

    const menuItems = menuContainer.querySelectorAll('li');
    menuItems.forEach(item => item.classList.remove('active-list'));

    if (isActive) {
      const activeItem = Array.from(menuItems).find(item => {
        const link = item.querySelector('a');
        return link && (link.getAttribute('href') === href || pathname.startsWith(link.getAttribute('href') || ''));
      });
      if (activeItem) {
        activeItem.classList.add('active-list');
      }
    }
  }, [pathname, href, isActive]);

  return (
    <li className={`list ${isActive ? 'active-list' : ''}`}>
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

