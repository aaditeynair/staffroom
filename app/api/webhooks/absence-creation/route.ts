import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Define a type for the teacher for better type safety
// interface Teacher {
//   id: string;
//   name: string;
// }

export async function POST(req: Request) {
  console.log("Webhook received. Starting processing...");
  try {
    const body = await req.json();
    console.log("Request body parsed:", body);

    // 1. Verify Supabase webhook signature
    const authHeader = req.headers.get("Authorization");
    console.log("Authorization header:", authHeader);
    const expectedAuth = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`;
    // To avoid timing attacks, it's better to compare strings in a way that
    // doesn't short-circuit. However, for debugging, direct comparison is fine.
    if (authHeader !== expectedAuth) {
      console.warn(
        "Unauthorized webhook attempt detected. Provided token:",
        authHeader,
      );
      return new Response("Unauthorized", { status: 401 });
    }
    console.log("Authorization successful.");

    // 2. Initialize Supabase Admin Client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    console.log("Supabase admin client initialized.");

    // 3. Extract data and fetch absent teacher's name
    const newAbsence = body.record;
    let teacherName = "A teacher"; // Default name

    if (newAbsence?.teacher_id) {
      console.log(`Fetching name for teacher ID: ${newAbsence.teacher_id}`);
      const { data: teacher, error: teacherError } = await supabase
        .from("teachers")
        .select("name")
        .eq("id", newAbsence.teacher_id)
        .single();
      if (teacherError) {
        console.error("Error fetching teacher's name:", teacherError);
      } else {
        teacherName = teacher.name;
        console.log(`Teacher name found: ${teacherName}`);
      }
    }

    // 4. Fetch all admin users
    console.log("Fetching admin users...");
    const { data: adminTeachers, error: adminError } = await supabase
      .from("teachers")
      .select("auth_id") // Only select the ID, as that's all we need
      .in("role", ["admin", "admin-teacher"]);

    if (adminError) {
      console.error("Error fetching admin users:", adminError);
      return new Response(`Error fetching admin users: ${adminError.message}`, {
        status: 500,
      });
    }

    if (!adminTeachers || adminTeachers.length === 0) {
      console.log("No admin teachers found to notify.");
      return NextResponse.json({ message: "No admins to notify." });
    }
    console.log(
      `Found ${adminTeachers.length} admin(s) to notify.`,
      adminTeachers.map((admin) => admin.auth_id),
    );

    // 5. Send a notification to each admin
    const notification = {
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
      headings: { en: "New Absence Submitted" },
      contents: { en: `${teacherName} has submitted a new absence request.` },
      include_external_user_ids: adminTeachers.map((admin) => admin.auth_id),
    };
    console.log("Sending notification to OneSignal:", notification);

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

    console.log(
      "Successfully sent notifications to admins via OneSignal:",
      responseData,
    );

    return NextResponse.json({ message: "Notifications sent successfully" });
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
