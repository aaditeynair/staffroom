import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/config";

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
      SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // 3. Extract data and determine status change
    const newRecord = body.record;
    const oldRecord = body.old_record;
    const teacherId = newRecord.teacher_id;

    if (!teacherId) {
      return new Response("Missing teacher_id in webhook payload", {
        status: 400,
      });
    }

    const oldStatus = oldRecord.status;
    const newStatus = newRecord.status;

    if (oldStatus === newStatus) {
      return NextResponse.json({ message: "No status change detected." });
    }

    // 4. Fetch the teacher's auth_id
    const { data: teacher, error: teacherError } = await supabase
      .from("teachers")
      .select("auth_id")
      .eq("id", teacherId)
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
    let notificationTitle = "";
    let notificationMessage = "";

    if (newStatus === "confirmed") {
      notificationTitle = "Absence Request Approved";
      notificationMessage = "Your absence request has been approved.";
    } else if (newStatus === "rejected") {
      notificationTitle = "Absence Request Rejected";
      notificationMessage = "Your absence request has been rejected.";
    } else {
      return NextResponse.json({ message: "Unhandled status change." });
    }

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
      message: "Notification sent successfully - Absence Status Change",
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
