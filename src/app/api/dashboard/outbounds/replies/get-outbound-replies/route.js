

import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import { TableCreator } from "@/app/utils/database/tableCreator";
import { readEmails } from "@/app/utils/readEamils";

const db = new DBFunctions();

export async function POST(req) {
  try {
    const body = await req.json();

    const { outbound_id, subject } = body;

    if (!outbound_id || !subject) {
      return NextResponse.json(
        { success: false, message: "All fields required." },
        { status: 400 }
      );
    }

    await TableCreator();

    const outbound = await db.findOutbound(outbound_id);
    if (!outbound.success) {
      return NextResponse.json(
        { success: false, message: "Outbound not found." },
        { status: 404 }
      );
    }

    const allocations = JSON.parse(outbound.data.list_allocations || "[]");

    let allreplies=[]

    for (let i = 0; i < allocations.length; i++) {
      const emailAssigned = allocations[i].emailAssigned;
      const emailSettings = await db.findEmailByemailAddress(emailAssigned);
      if (!emailSettings.success) {
        console.warn(`Skipping ${emailAssigned}: Email settings not found.`);
        continue;
      }

      const { access_token, refresh_token } = emailSettings.data;

      console.log(`
            EMAIL address ${emailAssigned},
            Access token: ${access_token},
            refreshtoken: ${refresh_token}

            `);

      const replies = await readEmails(
        emailAssigned,
        refresh_token,
        access_token,
        subject
      );

      allreplies = [...allreplies, ...replies]
    }

    //console.log("REPLIES")

    //console.log(allreplies)

    return NextResponse.json({
      success: true,
      message: "Task(s) scheduled successfully.",
      replies: allreplies,
    });
  } catch (error) {
    console.error("Task scheduling failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
