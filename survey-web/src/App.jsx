import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './protected/ProtectedRoute';

const HomePage = lazy(() => import('./pages/user/home/HomePage'));
const SurveyPage = lazy(() => import('./pages/user/survey/SurveyPage'));
const DashboardPage = lazy(() => import('./pages/admin/dashboard/DashboardPage'));
const AddTopicPage = lazy(() => import('./pages/admin/topic/AddTopicPage'));
const ListTopicPage = lazy(() => import('./pages/admin/topic/ListTopicPage'));
const UpdateTopicPage = lazy(() => import('./pages/admin/topic/UpdateTopicPage'));
const AddQuestionPage = lazy(() => import('./pages/admin/question/AddQuestionPage'));
const ListQuestionPage = lazy(() => import('./pages/admin/question/ListQuestionPage'));
const UpdateQuestionPage = lazy(() => import('./pages/admin/question/UpdateQuestionPage'));
const AddAnswerPage = lazy(() => import('./pages/admin/answer/AddAnswerPage'));
const ListAnswerPage = lazy(() => import('./pages/admin/answer/ListAnswerPage'));
const UpdateAnswerPage = lazy(() => import('./pages/admin/answer/UpdateAnswerPage'));
const AddInterestPage = lazy(() => import('./pages/admin/interest/AddInterestPage'));
const ListInterestPage = lazy(() => import('./pages/admin/interest/ListInterestPage'));
const UpdateInterestPage = lazy(() => import('./pages/admin/interest/UpdateInterestPage'));
const AddJobPage = lazy(() => import('./pages/admin/job/AddJobPage'));
const ListJobPage = lazy(() => import('./pages/admin/job/ListJobPage'));
const UpdateJobPage = lazy(() => import('./pages/admin/job/UpdateJobPage'));
const AddEducationPage = lazy(() => import('./pages/admin/education/AddEducationPage'));
const ListEducationPage = lazy(() => import('./pages/admin/education/ListEducationPage')); 
const UpdateEducationPage = lazy(() => import('./pages/admin/education/UpdateEducationPage')); 
const AddIncomePage = lazy(() => import('./pages/admin/income/AddIncomePage'));
const ListIncomePage = lazy(() => import('./pages/admin/income/ListIncomePage'));
const UpdateIncomePage = lazy(() => import('./pages/admin/income/UpdateIncomePage'));
const TrainingDataPage = lazy(() => import('./pages/admin/training/TrainingDataPage'));
const AccountPage = lazy(() => import('./pages/admin/account/AccountPage'));
const UpdateAccountPage = lazy(() => import('./pages/admin/account/UpdateAccountPage'));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout />
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "survey-page",
        element: <SurveyPage />
      },
    ]
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "add-topic",
        element: <AddTopicPage />
      },
      {
        path: "list-topic",
        element: <ListTopicPage />
      },
      {
        path: "update-topic/:id",
        element: <UpdateTopicPage />
      },
      {
        path: "add-question",
        element: <AddQuestionPage />
      },
      {
        path: "list-question",
        element: <ListQuestionPage />
      },
      {
        path: "update-question/:id",
        element: <UpdateQuestionPage />
      },
      {
        path: "add-answer",
        element: <AddAnswerPage />
      },
      {
        path: "list-answer",
        element: <ListAnswerPage />
      },
      {
        path: "update-answer/:id",
        element: <UpdateAnswerPage />
      },
      {
        path: "add-interest",
        element: <AddInterestPage />
      },
      {
        path: "list-interest",
        element: <ListInterestPage />
      },
      {
        path: "update-interest/:id",
        element: <UpdateInterestPage />
      },
      {
        path: "add-job",
        element: <AddJobPage />
      },
      {
        path: "list-job",
        element: <ListJobPage />
      },
      {
        path: "update-job/:id",
        element: <UpdateJobPage />
      },
      {
        path: "add-education",
        element: <AddEducationPage />
      },
      {
        path: "list-education",
        element: <ListEducationPage />
      },
      {
        path: "update-education/:id",
        element: <UpdateEducationPage />
      },
      {
        path: "add-income",
        element: <AddIncomePage />
      },
      {
        path: "list-income",
        element: <ListIncomePage />
      },
      {
        path: "update-income/:id",
        element: <UpdateIncomePage />
      },
      {
        path: "training-data",
        element: <TrainingDataPage />
      },
      {
        path: "account",
        element: <AccountPage />
      },
      {
        path: "update-account/:id",
        element: <UpdateAccountPage />
      },
    ]
  },
]);

const App = () => {
  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;