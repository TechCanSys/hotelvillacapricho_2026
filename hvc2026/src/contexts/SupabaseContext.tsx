
import React, { createContext, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

type SupabaseContextType = {
  supabase: SupabaseClient;
};

export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabaseContext must be used within a SupabaseProvider');
  }
  return context;
}

export const SupabaseProvider: React.FC<{
  children: React.ReactNode;
  supabase: SupabaseClient;
}> = ({ children, supabase }) => {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};
