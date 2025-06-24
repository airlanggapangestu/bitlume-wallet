import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./core/style/global.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router";
import HomePage from "./pages/home-page.jsx";
import { AuthProvider } from "@/core/providers/auth-provider";
import { Toaster } from "@/core/components/ui/toaster";
import NotFoundPage from "./pages/SEO/not-found-page";
import DashboardAssets from "./pages/dashboard";
import AuthGuard from "./core/components/auth/auth-guard";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

const customStyles = `
  #nprogress .bar {
    background: #10b981 !important;
    height: 3px !important;
  }
  #nprogress .peg {
    box-shadow: 0 0 10px #10b981, 0 0 5px #10b981 !important;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);

function NProgressRouter() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 500);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    return () => {
      clearTimeout(timer);
      NProgress.remove();
    };
  }, [location, navigationType]);

  return null;
}

// function MusicPlayer() {
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const playMusic = () => {
//       audioRef.current?.play().catch((err) => console.warn("Autoplay blocked", err));
//     };

//     window.addEventListener("click", playMusic, { once: true });
//     return () => window.removeEventListener("click", playMusic);
//   }, []);

//   return <audio ref={audioRef} src="/music/theme.mp3" loop />;
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NProgressRouter />
        <Routes>
          <Route index element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardAssets />
              </AuthGuard>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
