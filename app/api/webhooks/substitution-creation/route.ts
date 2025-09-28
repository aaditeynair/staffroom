import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Verify Supabase webhook signature
    const authHeader = req.headers.get("Authorization");
    const expectedAuth = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`;
    if (authHeader !== expectedAuth) {
      console.warn(
        "Unauthorized webhook attempt detected. Provided token:",
        authHeader,
      );
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Initialize Supabase Admin Client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // 3. Extract data
    const newRecord = body.record;
    const { substitute_teacher, date, period_number } = newRecord;

    // 4. Fetch the teacher's auth_id
    const { data: teacher, error: teacherError } = await supabase
      .from("teachers")
      .select("auth_id")
      .eq("id", substitute_teacher)
      .single();

    if (teacherError) {
      console.error("Error fetching teacher's auth_id:", teacherError);
      return new Response(
        `Error fetching teacher's auth_id: ${teacherError.message}`,
        {
          status: 500,
        },
      );
    }

    if (!teacher) {
      return new Response("Teacher not found", { status: 404 });
    }

    // 5. Send a notification to the teacher
    const notificationTitle = "New Substitution Assigned";
    const notificationMessage = `You have been assigned a new substitution on ${dayjs(date).format("ddd, DD/MM/YYYY")} for period ${period_number}`;

    const notification = {
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
      headings: { en: notificationTitle },
      contents: { en: notificationMessage },
      include_external_user_ids: [teacher.auth_id],
    };

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(notification),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("OneSignal API Error:", responseData);
      return new Response("Error sending notification", { status: 500 });
    }

    return NextResponse.json({
      message: "Notification sent successfully - New Substitution",
    });
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error handling webhook:", error);
    return new Response(`Error handling webhook: ${errorMessage}`, {
      status: 500,
    });
  }
}
