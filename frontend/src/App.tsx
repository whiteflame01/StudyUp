import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RootRedirect } from "@/components/RootRedirect";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import FeedPage from "./pages/FeedPage";
import ChatsPage from "./pages/ChatsPage";
import MessagesPage from "./pages/MessagesPage";
import ExplorePage from "./pages/ExplorePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SocketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route 
                path="/" 
                element={<RootRedirect />} 
              />
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false} redirectTo="/app/feed">
                    <LoginPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <ProtectedRoute requireAuth={false} redirectTo="/app/feed">
                    <RegisterPage />
                  </ProtectedRoute>
                } 
              />

              {/* Protected routes */}
              <Route 
                path="/app"
                element={
                  <ProtectedRoute requireAuth={true} redirectTo="/login">
                    <MainPage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/feed" replace />} />
                <Route path="feed" element={<FeedPage />} />
                <Route path="chats" element={<ChatsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="explore" element={<ExplorePage />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
