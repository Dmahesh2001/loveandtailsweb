import iconHome from '@/assets/icons/nav-icon-home.svg';
import iconHomeActive from '@/assets/icons/nav-icon-home-filled.svg';
import iconSearch from '@/assets/icons/nav-icon-search.svg';
import iconSearchActive from '@/assets/icons/nav-icon-search-filled.svg';
import iconMoments from '@/assets/icons/nav-icon-moments.svg';
import iconMomentsActive from '@/assets/icons/nav-icon-moments-filled.svg';
import iconAdopt from '@/assets/icons/nav-icon-adopt.svg';
import iconAdoptActive from '@/assets/icons/nav-icon-adopt-filled.svg';
import iconMessages from '@/assets/icons/nav-icon-messages.svg';
import iconMessagesActive from '@/assets/icons/nav-icon-messages-filled.svg';
import iconNotifications from '@/assets/icons/nav-icon-notifications.svg';
import iconNotificationsActive from '@/assets/icons/nav-icon-notifications-filled.svg';
import iconCreate from '@/assets/icons/nav-icon-create.svg';
import iconCreateActive from '@/assets/icons/nav-icon-create-filled.svg';
import iconMore from '@/assets/icons/nav-icon-more.svg';
import iconMoreActive from '@/assets/icons/nav-icon-more-filled.svg';
import avatar from '@/assets/images/shell/web-nav-avatar.png';

export const ME = {
  name: 'Ria Madrid',
  firstName: 'Ria',
  handle: '@riamadrid',
  location: 'Madrid, Spain',
  avatar,
};

// Selected items use the filled icon (avatar gets a ring instead).
// Sidebar order matches Figma "Web / Sidebar" (1475:152), plus Moments (Figma "13 · Reels").
export const SIDEBAR_NAV = [
  { to: '/home', label: 'Home', icon: iconHome, activeIcon: iconHomeActive },
  { to: '/search', label: 'Search', icon: iconSearch, activeIcon: iconSearchActive },
  { to: '/moments', label: 'Moments', icon: iconMoments, activeIcon: iconMomentsActive },
  { to: '/adopt', label: 'Adopt', icon: iconAdopt, activeIcon: iconAdoptActive, section: '/applications' },
  { to: '/messages', label: 'Messages', icon: iconMessages, activeIcon: iconMessagesActive, badge: 3 },
  { to: '/notifications', label: 'Notifications', icon: iconNotifications, activeIcon: iconNotificationsActive, badge: 5 },
  { to: '/create', label: 'Create', icon: iconCreate, activeIcon: iconCreateActive },
  { to: '/profile', label: 'Profile', avatar: true, section: '/pets' },
];

export const MORE_ICON = iconMore;
export const MORE_ICON_ACTIVE = iconMoreActive;
