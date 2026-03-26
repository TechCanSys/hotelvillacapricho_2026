
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from './integrations/supabase/client';
import { SupabaseProvider } from './contexts/SupabaseContext';
import MediaManager from './pages/MediaManager';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SupabaseProvider supabase={supabase}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/media" element={<MediaManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </SupabaseProvider>
    </ThemeProvider>
  );
}

export default App;
