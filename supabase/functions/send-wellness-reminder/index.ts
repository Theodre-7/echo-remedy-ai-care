
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WellnessReminderRequest {
  email: string;
  name: string;
  reminderType: string;
}

// Wellness reminder categories
const wellnessReminders = {
  daily_habits: [
    "Hydrate to heal – drink a glass of water now 💧",
    "Time for a quick stretch! Loosen up those joints 🧘‍♂️",
    "Wash your hands! Your health starts with hygiene ✋🧼",
    "Take a deep breath. Hold. Exhale slowly. Do it 3 times 🌬️",
    "Step outside for 5 mins of sunlight – your body will thank you ☀️"
  ],
  rest_recovery: [
    "Healing needs rest. Don't skip sleep tonight 😴",
    "Let your body recover — take a tech break for 10 mins 📵",
    "Had symptoms lately? Give your body some downtime 🛏️"
  ],
  food_nutrition: [
    "Add a fruit to your next meal – it's nature's medicine 🍎",
    "Warm turmeric milk helps with inflammation – try it tonight! 🥛✨",
    "Don't skip meals – healing starts with nourishment 🍲"
  ],
  symptom_care: [
    "Feeling unwell? Don't guess – scan with EchoRemedy 📸",
    "Recheck old symptoms? Visit your scan history anytime 🧾",
    "Take a moment to log how you're feeling today 📝"
  ],
  medxobot_engagement: [
    "Got a question about that rash or cut? MedxoBot is here 24/7 🤖💬",
    "Need a second opinion? Ask MedxoBot for a remedy or tip 🧠"
  ],
  mind_mood: [
    "Smile check 😊 – you're doing better than you think",
    "Mental health matters – write 1 thing you're grateful for today 💙",
    "Feeling low? Deep breaths + 5 positive thoughts 🌈"
  ],
  weekly_wellness: [
    "It's Sunday – review your scan history and progress 📊",
    "Midweek tip: Try a simple home remedy for that minor ache 🧂",
    "New week, new journal entry – how are you feeling lately? 📔"
  ]
};

const getRandomReminder = () => {
  const categories = Object.keys(wellnessReminders);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const categoryReminders = wellnessReminders[randomCategory as keyof typeof wellnessReminders];
  const randomReminder = categoryReminders[Math.floor(Math.random() * categoryReminders.length)];
  
  return {
    category: randomCategory.replace('_', ' ').toUpperCase(),
    message: randomReminder
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, reminderType }: WellnessReminderRequest = await req.json();

    const reminder = getRandomReminder();

    const emailResponse = await resend.emails.send({
      from: "EchoRemedy <onboarding@resend.dev>",
      to: [email],
      subject: `🌟 Your Daily Wellness Reminder from EchoRemedy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🩺 EchoRemedy Wellness Reminder</h1>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #1e293b; margin-bottom: 10px;">Hello ${name}! 👋</h2>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #3b82f6; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${reminder.category}</h3>
              <p style="font-size: 18px; color: #374151; margin: 10px 0; line-height: 1.5;">${reminder.message}</p>
            </div>
            
            <div style="background: #f1f5f9; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #64748b; font-size: 14px; text-align: center;">
                💡 <strong>Remember:</strong> Small daily actions lead to big health improvements!
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
              <a href="${req.headers.get('origin') || 'https://your-app-url.com'}/dashboard" 
                 style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                🔄 Visit EchoRemedy Dashboard
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
              This is an automated wellness reminder. Stay healthy with EchoRemedy! 💙
            </p>
          </div>
        </div>
      `,
    });

    console.log("Wellness reminder sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      reminder: reminder,
      emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-wellness-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
