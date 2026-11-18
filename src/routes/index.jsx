/*
 * All app routes live in this one file.
 * Usage: `import { router } from '@/routes'`.
 */
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from '@/components/app/AppShell';
import FeedSkeleton from '@/components/app/FeedSkeleton';
import { RequireAuth } from '@/lib/auth';
import Splash from '@/pages/public/Splash';
import NotFound from '@/pages/status/NotFound';
import UnderConstruction from '@/pages/status/UnderConstruction';

/*
 * While true, every route shows the puppy "we're building" page.
 * Set VITE_UNDER_CONSTRUCTION=false to open the app. Unset, it's on in
 * production builds and off in dev (where /building previews the page).
 */
const UNDER_CONSTRUCTION =
  (import.meta.env.VITE_UNDER_CONSTRUCTION ?? String(import.meta.env.PROD)) === 'true';

/* ---------- pages (lazy-loaded) ---------- */

// public
const Landing = lazy(() => import('@/pages/public/Landing'));
const ComingSoon = lazy(() => import('@/pages/status/ComingSoon'));

// auth
const Login = lazy(() => import('@/pages/auth/Login'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const WelcomeBack = lazy(() => import('@/pages/auth/WelcomeBack'));

// onboarding
const Onboarding = lazy(() => import('@/pages/onboarding/Onboarding'));
const BadgeQuiz = lazy(() => import('@/pages/onboarding/BadgeQuiz'));
const KycVerification = lazy(() => import('@/pages/onboarding/KycVerification'));
const MediaEditor = lazy(() => import('@/pages/app/MediaEditor'));

// app
const HomeFeed = lazy(() => import('@/pages/app/HomeFeed'));
const Search = lazy(() => import('@/pages/app/Search'));
const Share = lazy(() => import('@/pages/app/Share'));
const Permissions = lazy(() => import('@/pages/app/Permissions'));
const Moments = lazy(() => import('@/pages/app/Moments'));
const CreatePost = lazy(() => import('@/pages/app/CreatePost'));
const Adopt = lazy(() => import('@/pages/app/Adopt'));
const CreateAdoptionProfile = lazy(() => import('@/pages/app/CreateAdoptionProfile'));
const PetDetails = lazy(() => import('@/pages/app/PetDetails'));
const Profile = lazy(() => import('@/pages/app/Profile'));
const MyPetProfile = lazy(() => import('@/pages/app/MyPetProfile'));
const Documents = lazy(() => import('@/pages/app/Documents'));
const ApplicationStatus = lazy(() => import('@/pages/app/ApplicationStatus'));
const Notifications = lazy(() => import('@/pages/app/Notifications'));
const Messages = lazy(() => import('@/pages/app/Messages'));

// settings
const SettingsLayout = lazy(() => import('@/pages/settings/SettingsLayout'));
const EditProfile = lazy(() => import('@/pages/settings/EditProfile'));
const SwitchAccounts = lazy(() => import('@/pages/settings/SwitchAccounts'));
const HelpCentre = lazy(() => import('@/pages/settings/Preferences').then((m) => ({ default: m.HelpCentre })));
const LanguageSettings = lazy(() => import('@/pages/settings/Preferences').then((m) => ({ default: m.LanguageSettings })));
const NotificationSettings = lazy(() => import('@/pages/settings/Preferences').then((m) => ({ default: m.NotificationSettings })));
const PrivacySettings = lazy(() => import('@/pages/settings/Preferences').then((m) => ({ default: m.PrivacySettings })));

/* ---------- routes ---------- */

const publicRoutes = [
  { path: '/building', element: <UnderConstruction /> },
  { path: '/', element: <Landing /> },
  { path: '/coming-soon', element: <ComingSoon /> },
];

const authRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/welcome-back', element: <WelcomeBack /> },
];

// Full-screen flows (no app shell) for signed-in users.
const onboardingRoutes = [
  { path: '/onboarding', element: <Navigate to="/onboarding/1" replace /> },
  { path: '/onboarding/:step', element: <Onboarding /> },
  { path: '/personalize', element: <Navigate to="/onboarding/4" replace /> },
  { path: '/badge-quiz', element: <Navigate to="/badge-quiz/1" replace /> },
  { path: '/badge-quiz/:q', element: <BadgeQuiz /> },
  { path: '/kyc', element: <KycVerification /> },
  { path: '/create/edit', element: <MediaEditor /> },
  { path: '/splash', element: <Splash to="/home" /> },
];

const settingsRoutes = [
  { path: '/settings/accounts', element: <SwitchAccounts /> },
  {
    path: '/settings',
    element: <SettingsLayout />,
    handle: { bg: 'white', mobileHeader: false },
    children: [
      { path: 'profile', element: <EditProfile />, handle: { mobileHeader: false } },
      { path: 'notifications', element: <NotificationSettings />, handle: { mobileHeader: false } },
      { path: 'privacy', element: <PrivacySettings />, handle: { mobileHeader: false } },
      { path: 'language', element: <LanguageSettings />, handle: { mobileHeader: false } },
      { path: 'help', element: <HelpCentre />, handle: { mobileHeader: false } },
    ],
  },
];

// Pages rendered inside <AppShell /> (sidebar / tab bar).
const appRoutes = [
  { path: '/home', element: <HomeFeed /> },
  { path: '/search', element: <Search />, handle: { bg: 'white' } },
  ...settingsRoutes,
  { path: '/share', element: <Share /> },
  { path: '/permissions', element: <Permissions /> },
  { path: '/loading', element: <FeedSkeleton />, handle: { bg: 'white' } },
  { path: '/moments/:momentId?', element: <Moments />, handle: { bg: 'white', mobileHeader: false } },
  { path: '/reels', element: <Navigate to="/moments" replace /> },
  { path: '/create', element: <CreatePost />, handle: { tabBar: false, mobileHeader: false } },
  { path: '/adopt', element: <Adopt />, handle: { bg: 'white' } },
  {
    path: '/adopt/new',
    element: <CreateAdoptionProfile />,
    handle: { bg: 'white', mobileHeader: false, tabBar: false },
  },
  { path: '/adopt/:petId', element: <PetDetails />, handle: { bg: 'white' } },
  { path: '/profile', element: <Profile />, handle: { bg: 'white', mobileHeader: false } },
  { path: '/pets/:petId', element: <MyPetProfile />, handle: { bg: 'white', mobileHeader: false } },
  { path: '/pets/:petId/documents', element: <Documents /> },
  {
    path: '/applications',
    element: <ApplicationStatus />,
    handle: { mobileHeader: false, tabBar: false },
  },
  { path: '/notifications', element: <Notifications />, handle: { bg: 'white' } },
  { path: '/messages', element: <Messages />, handle: { bg: 'white' } },
  {
    path: '/messages/:conversationId',
    element: <Messages />,
    handle: { mobileHeader: false, tabBar: false, bg: 'white' },
  },
];

const routes = [
  ...publicRoutes,
  ...authRoutes,
  {
    // Everything below needs a signed-in user (JWT from LTBackend).
    element: <RequireAuth />,
    children: [...onboardingRoutes, { element: <AppShell />, children: appRoutes }],
  },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(
  UNDER_CONSTRUCTION ? [{ path: '*', element: <UnderConstruction /> }] : routes
);
