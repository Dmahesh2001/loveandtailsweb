import iconHome from '@/assets/figma/shell/nav-icon-home.svg';
import iconHomeActive from '@/assets/figma/shell/nav-icon-home-active.svg';
import iconSearch from '@/assets/figma/shell/nav-icon-search.svg';
import iconAdopt from '@/assets/figma/shell/nav-icon-adopt.svg';
import iconAdoptActive from '@/assets/figma/shell/nav-icon-adopt-active.svg';
import iconMessages from '@/assets/figma/shell/nav-icon-messages.svg';
import iconMessagesActive from '@/assets/figma/shell/nav-icon-messages-active.svg';
import iconNotifications from '@/assets/figma/shell/nav-icon-notifications.svg';
import iconNotificationsActive from '@/assets/figma/shell/nav-icon-notifications-active.svg';
import iconCreate from '@/assets/figma/shell/nav-icon-create.svg';
import iconMore from '@/assets/figma/shell/nav-icon-more.svg';
import iconMoreActive from '@/assets/figma/shell/nav-icon-more-active.svg';
import iconProfileActive from '@/assets/figma/shell/nav-icon-profile-active.svg';
import avatar from '@/assets/figma/shell/web-nav-avatar.png';

export const ME = {
  name: 'Ria Madrid',
  firstName: 'Ria',
  handle: '@riamadrid',
  location: 'Madrid, Spain',
  avatar,
};

// Sidebar order matches Figma "Web / Sidebar" (1475:152).
export const SIDEBAR_NAV = [
  { to: '/home', label: 'Home', icon: iconHome, activeIcon: iconHomeActive, section: '/reels' },
  { to: '/search', label: 'Search', icon: iconSearch },
  { to: '/adopt', label: 'Adopt', icon: iconAdopt, activeIcon: iconAdoptActive, section: '/applications' },
  { to: '/messages', label: 'Messages', icon: iconMessages, activeIcon: iconMessagesActive, badge: 3 },
  { to: '/notifications', label: 'Notifications', icon: iconNotifications, activeIcon: iconNotificationsActive, badge: 5 },
  { to: '/create', label: 'Create', icon: iconCreate },
  { to: '/profile', label: 'Profile', avatar: true, activeIcon: iconProfileActive, section: '/pets' },
];

export const MORE_ICON = iconMore;
export const MORE_ICON_ACTIVE = iconMoreActive;
