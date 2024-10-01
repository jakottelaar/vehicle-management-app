import { NextRequest } from "next/server";
import prisma from "../../../../../prisma/client";
import { auth } from "@/lib/firebase/firebase-admin-config";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authorizationHeader = req.headers.get("authorization");

  if (!authorizationHeader) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken.uid) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!vehicle) {
      return Response.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return Response.json(vehicle);
  } catch (error) {
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
