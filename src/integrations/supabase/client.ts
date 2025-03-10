
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { format } from 'date-fns';
import { UserRole } from '@/lib/types';
import { supervisors } from '@/data/supervisors';

const SUPABASE_URL = "https://jourdleqqgzkwdaylrcc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdXJkbGVxcWd6a3dkYXlscmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDM0NzUsImV4cCI6MjA1NzE3OTQ3NX0.7s1WzoYy-t72agRmpoA_CP_MOykOZkhUFQ5jNqWEs0o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper function to format Date objects to Supabase-compatible format
export const formatDateForSupabase = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Function to get the current user's role
export const getCurrentUserRole = async (): Promise<UserRole | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Check if the user's email is in the supervisors list
    const supervisorEmails = supervisors.map(supervisor => 
      `${supervisor.name.toLowerCase().replace(/\s+/g, '.')}@example.com`
    );
    
    const userEmail = user.email?.toLowerCase();
    
    // If user's email is in supervisor list, assign supervisor role
    if (userEmail && supervisorEmails.includes(userEmail)) {
      return UserRole.SUPERVISOR;
    }
    
    // Admin check - you can change this to your specific admin email
    if (userEmail === 'admin@example.com') {
      return UserRole.ADMIN;
    }

    // Default to viewer role
    return UserRole.VIEWER;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Function to create a new site
export const createSite = async (siteData: any) => {
  try {
    // Format the dates
    const formattedData = {
      ...siteData,
      start_date: formatDateForSupabase(siteData.start_date),
      completion_date: siteData.completion_date ? formatDateForSupabase(siteData.completion_date) : null
    };

    const { data, error } = await supabase
      .from('sites')
      .insert(formattedData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

// Function to get all sites
export const getAllSites = async () => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all sites:', error);
    return [];
  }
};

// Function to get sites by supervisor
export const getSitesBySupervisor = async (supervisorId: string) => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('supervisor_id', supervisorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching supervisor sites:', error);
    return [];
  }
};
