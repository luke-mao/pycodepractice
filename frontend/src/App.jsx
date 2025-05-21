import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import NavigationBar from "./components/NavigationBar";
import { useModal, useStore } from "./store/store";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ChallengesPage from "./pages/ChallengesPage";
import NotFoundPage from "./pages/NotFoundPage";
import MainPage from "./pages/MainPage";
import AITutorPage from "./pages/AITutorPage";
import ModalContainer from "./components/ModalContainer";
import NewChallenge from "./pages/NewChallenge";
import EditChallenge from "./pages/EditChallenge";
import EditProfilePage from "./pages/EditProfilePage";
import ChallengeSubmissionPage from "./pages/ChallengeSubmissionPage";
import ChallengePage from "./pages/ChallengePage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";

/**
 * App Component
 *
 * Root component that defines the main routing structure of the application.
 * Renders global components like the navigation bar and modal, and conditionally displays routes based on login state and user role.
 */
export default function App() {
  const { isLogin, isLoading, userInfo } = useStore();

  // modal
  const { modal, hideModal } = useModal();

  return (
    <Container fluid className="m-0 p-0">
      <NavigationBar />
      <Container fluid className="m-0 p-0">
        {/* make sure the user login state is loaded, then show the routes */}
        {isLoading ? (
          <div className="text-center">
            <h4>Loading...</h4>
          </div>
        ) : (
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/challenges/:challengeId" element={<ChallengePage />} />
            <Route path="/ai-tutor" element={<AITutorPage />} />

            {/* Auth Routes */}
            {!isLogin && (
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </>
            )}
            {/* for logged in user & admin */}
            {isLogin && (
              <>
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
                <Route path="/submission/:submissionId" element={<ChallengeSubmissionPage />} />
              </>
            )}
            {/* only for the admin */}
            {isLogin && userInfo?.role === "admin" && (
              <>
                <Route path="/new-challenge" element={<NewChallenge />} />
                <Route path="/challenges/:challengeId/edit" element={<EditChallenge />} />
                <Route path="/users" element={<AdminUsersPage />} />
                <Route path="/analytics" element={<AdminAnalyticsPage />} />
              </>
            )}
            {/* 404 - Redirect to Home */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </Container>
      {/* the modal */}
      <ModalContainer
        show={modal.show}
        title={modal.title}
        body={modal.body}
        okText={modal.okText}
        cancelText={modal.cancelText}
        showCancelButton={modal.showCancelButton}
        onOk={() => {
          modal.onOk();
          hideModal();
        }}
        onCancel={() => {
          modal.onCancel();
          hideModal();
        }}
      />
    </Container>
  );
}
