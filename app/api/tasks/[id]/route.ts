import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/utils/auth";
import { TaskPriority, TaskStatus } from "@/lib/generated/prisma";

// ✅ Fonction GET — Récupérer une tâche
export async function GET(request: NextRequest, context: any) {
  const { params } = await context;
  const taskId = params.id;

  try {
    const authResult = authenticateRequest(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId: authenticatedUserId } = authResult;

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId: authenticatedUserId,
        deletedAt: null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Tâche non trouvée." }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche:", error);
    return NextResponse.json(
      { message: "Échec de la récupération de la tâche", error },
      { status: 500 }
    );
  }
}

// ✅ Fonction PUT — Mettre à jour une tâche
export async function PUT(request: NextRequest, context: any) {
  const { params } = await context;
  const taskId = params.id;

  if (!taskId || typeof taskId !== "string") {
    return NextResponse.json({ message: "ID de tâche invalide." }, { status: 400 });
  }

  try {
    const authResult = authenticateRequest(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId: authenticatedUserId } = authResult;

    const { title, description, status, priority, dueDate } = await request.json();

    const updateData: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status as any; // Cast to TaskStatus or EnumTaskStatusFieldUpdateOperationsInput
    if (priority !== undefined) updateData.priority = priority as any; // Cast to TaskPriority or EnumTaskPriorityFieldUpdateOperationsInput
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        userId: authenticatedUserId,
        deletedAt: null,
      },
      data: updateData,
    });

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, error);

    if (error.code === "P2025") {
      return NextResponse.json({ message: "Tâche non trouvée pour la mise à jour." }, { status: 404 });
    }

    return NextResponse.json({ message: "Échec de la mise à jour de la tâche", error }, { status: 500 });
  }
}

// ✅ Fonction DELETE — Suppression logique
export async function DELETE(request: NextRequest, context: any) {
  const { params } = await context;
  const taskId = params.id;

  if (!taskId || typeof taskId !== "string") {
    return NextResponse.json({ message: "ID de tâche invalide." }, { status: 400 });
  }

  try {
    const authResult = authenticateRequest(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId: authenticatedUserId } = authResult;

    const task = await prisma.task.update({
      where: {
        id: taskId,
        userId: authenticatedUserId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
      select: { id: true, title: true, deletedAt: true },
    });

    return NextResponse.json({ message: `Tâche "${task.title}" marquée comme supprimée.`, task });
  } catch (error) {
    console.error(`Erreur lors de la suppression douce de la tâche ${taskId}:`, error);
    return NextResponse.json({ message: "Échec de la suppression douce de la tâche", error }, { status: 500 });
  }
}
