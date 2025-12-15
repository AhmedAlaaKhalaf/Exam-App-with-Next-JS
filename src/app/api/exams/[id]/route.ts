import { authOption } from "@/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOption);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `https://exam.elevateegy.com/api/v1/exams/${params.id}`,
      {
        headers: {
          token: accessToken,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch exam" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const exam = data.exam || data;
    
    return NextResponse.json({ title: exam?.title || params.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

