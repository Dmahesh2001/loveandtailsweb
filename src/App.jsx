import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import AppShell from './components/app/AppShell';
import NotFound from './pages/NotFound';
import Splash, { SplashScreen } from './pages/Splash';
import FeedSkeleton from './components/app/FeedSkeleton';

const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const HomeFeed = lazy(() => import('./pages/app/HomeFeed'));
const Messages = lazy(() => import('./pages/app/Messages'));
const Adopt = lazy(() => import('./pages/app/Adopt'));
const PetDetails = lazy(() => import('./pages/app/PetDetails'));
const Profile = lazy(() => import('./pages/app/Profile'));
const Notifications = lazy(() => import('./pages/app/Notifications'));
const MyPetProfile = lazy(() => import('./pages/app/MyPetProfile'));
const Documents = lazy(() => import('./pages/app/Documents'));
const ApplicationStatus = lazy(() => import('./pages/app/ApplicationStatus'));
const CreatePost = lazy(() => import('./pages/app/CreatePost'));
const Moments = lazy(() => import('./pages/app/Moments'));
const CreateAdoptionProfile = lazy(() => import('./pages/app/CreateAdoptionProfile'));
const SettingsLayout = lazy(() => import('./pages/settings/SettingsLayout'));
const EditProfile = lazy(() => import('./pages/settings/EditProfile'));
const SwitchAccounts = lazy(() => import('./pages/settings/SwitchAccounts'));
const SharePage = lazy(() => import('./pages/app/SharePage'));
const MediaEditor = lazy(() => import('./pages/app/MediaEditor'));
const Permissions = lazy(() => import('./pages/app/Permissions'));
const Landing = lazy(() => import('./pages/Landing'));
const Search = lazy(() => import('./pages/app/Search'));
const HelpCentre = lazy(() => import('./pages/settings/Preferences').then((m) => ({ default: m.HelpCentre })));
const LanguageSettings = lazy(() => import('./pages/settings/Preferences').then((m) => ({ default: m.LanguageSettings })));
const NotificationSettings = lazy(() => import('./pages/settings/Preferences').then((m) => ({ default: m.NotificationSettings })));
const PrivacySettings = lazy(() => import('./pages/settings/Preferences').then((m) => ({ default: m.PrivacySettings })));
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const WelcomeBack = lazy(() => import('./pages/auth/WelcomeBack'));
const Onboarding = lazy(() => import('./pages/onboarding/Onboarding'));
const BadgeQuiz = lazy(() => import('./pages/onboarding/BadgeQuiz'));
const KycVerification = lazy(() => import('./pages/onboarding/KycVerification'));

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/coming-soon', element: <ComingSoon /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/welcome-back', element: <WelcomeBack /> },
  { path: '/onboarding', element: <Navigate to="/onboarding/1" replace /> },
  { path: '/onboarding/:step', element: <Onboarding /> },
  { path: '/personalize', element: <Navigate to="/onboarding/4" replace /> },
  { path: '/badge-quiz', element: <Navigate to="/badge-quiz/1" replace /> },
  { path: '/badge-quiz/:q', element: <BadgeQuiz /> },
  { path: '/kyc', element: <KycVerification /> },
  { path: '/create/edit', element: <MediaEditor /> },
  { path: '/splash', element: <Splash to="/home" /> },
  {
    element: <AppShell />,
    children: [
      { path: '/home', element: <HomeFeed /> },
      { path: '/search', element: <Search />, handle: { bg: 'white' } },
      { path: '/settings/accounts', element: <SwitchAccounts /> },
      { path: '/share', element: <SharePage /> },
      { path: '/permissions', element: <Permissions /> },
      { path: '/loading', element: <FeedSkeleton />, handle: { bg: 'white' } },
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
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default function App() {
  // Top-level routes load lazily; the Figma Splash (1495:13209) covers the wait.
  // Pages inside the app shell use the Loading skeleton instead (see AppShell).
  return (
    <Suspense fallback={<SplashScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
