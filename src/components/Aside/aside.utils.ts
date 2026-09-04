import type { AsideAccess, AsideGroupLink, AsideLink } from "./aside.types";

export const isGroupLink = (item: AsideLink): item is AsideGroupLink =>
  Array.isArray(item.children) && item.children.length > 0;

export const isItemActive = (item: AsideLink, pathname: string): boolean => {
  if (item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`))) {
    return true;
  }

  if (isGroupLink(item)) {
    return item.children.some((child) => isItemActive(child, pathname));
  }

  return false;
};

export const hasAccess = (access: AsideAccess | undefined, role?: string | null): boolean => {
  if (!access) {
    return true;
  }

  if (!role) {
    return false;
  }

  return Array.isArray(access) ? access.includes(role) : access === role;
};

export const filterLinksByAccess = (
  links: AsideLink[],
  role?: string | null,
): AsideLink[] =>
  links.flatMap((link): AsideLink[] => {
    if (!hasAccess(link.access, role)) {
      return [];
    }

    if (!isGroupLink(link)) {
      return [link];
    }

    const children = filterLinksByAccess(link.children, role);

    if (children.length > 0) {
      return [{ ...link, children }];
    }

    if (link.href) {
      return [
        {
          id: link.id,
          label: link.label,
          icon: link.icon,
          access: link.access,
          href: link.href,
        },
      ];
    }

    return [];
  });
