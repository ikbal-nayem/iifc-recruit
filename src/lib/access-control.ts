import { NavPermission, rolePermissions } from '@/config/access.config';
import { ROLES } from '@/constants/auth.constant';
import { NavLink } from './nav-links';

const hasPermission = (userRoles: ROLES[], permissionKey: NavPermission | string): boolean => {
	for (const role of userRoles) {
		const permissions = rolePermissions[role];
		if (!permissions) continue;

		if (permissions.allow?.includes('*')) return true;

		if (permissions.allow) {
			if (permissions.allow.includes(permissionKey as NavPermission)) {
				return true;
			}
		} else if (permissions.notAllow) {
			if (!permissions.notAllow.includes(permissionKey as NavPermission)) {
				return true;
			}
		} else {
			// If neither allow nor notAllow is defined, default to allowing access (for roles like IIFC_ADMIN)
			return true;
		}
	}
	return false;
};

const filterByRole = (links: NavLink[], userRoles: ROLES[]): NavLink[] => {
	return links.reduce((acc: NavLink[], link: NavLink) => {
		let hasAccess = hasPermission(userRoles, link.key);

		if (link.submenu) {
			const filteredSubmenu = filterByRole(link.submenu, userRoles);
			if (filteredSubmenu.length > 0) {
				// If a parent menu item itself doesn't have a specific permission but its children do,
				// it should be visible.
				hasAccess = true;
				acc.push({ ...link, submenu: filteredSubmenu });
			}
		} else if (hasAccess) {
			acc.push(link);
		}

		return acc;
	}, []);
};

export const filterNavLinksByRole = (links: NavLink[], userRoles: ROLES[]): NavLink[] => {
	// First, filter out any items the user does not have access to at all.
	const accessibleLinks = filterByRole(links, userRoles);

	// Then, for roles that have `notAllow`, we need to do a second pass to remove those items.
	const rolesWithNotAllow = userRoles.filter((role) => rolePermissions[role]?.notAllow);

	if (rolesWithNotAllow.length === 0) {
		return accessibleLinks;
	}

	const notAllowedKeys = new Set<string>();
	rolesWithNotAllow.forEach((role) => {
		rolePermissions[role]?.notAllow?.forEach((key) => notAllowedKeys.add(key));
	});

	const finalFilter = (linksToFilter: NavLink[]): NavLink[] => {
		return linksToFilter.reduce((acc: NavLink[], link: NavLink) => {
			if (notAllowedKeys.has(link.key)) {
				return acc;
			}
			if (link.submenu) {
				const filteredSubmenu = finalFilter(link.submenu);
				if (filteredSubmenu.length > 0) {
					acc.push({ ...link, submenu: filteredSubmenu });
				} else if (!notAllowedKeys.has(link.key)) {
					// if all children are removed, but the parent is not explicitly disallowed, keep it if it has a link.
					// For parent menu that acts as a category, we might want to remove it if all children are gone.
					// Current logic: if it has children, it must have at least one accessible child to show up.
				}
			} else {
				acc.push(link);
			}
			return acc;
		}, []);
	};

	return finalFilter(accessibleLinks);
};
