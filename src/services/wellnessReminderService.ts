
import { supabase } from '@/integrations/supabase/client';

export interface WellnessReminderRequest {
  email: string;
  name: string;
  reminderType: string;
}

export const sendWellnessReminder = async (data: WellnessReminderRequest) => {
  try {
    const { data: result, error } = await supabase.functions.invoke('send-wellness-reminder', {
      body: data
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error sending wellness reminder:', error);
    throw error;
  }
};

export const scheduleWellnessReminder = async (userEmail: string, userName: string) => {
  return sendWellnessReminder({
    email: userEmail,
    name: userName,
    reminderType: 'daily'
  });
};
