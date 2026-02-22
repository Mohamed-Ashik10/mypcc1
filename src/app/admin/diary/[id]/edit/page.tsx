import DiaryForm from "@/components/DiaryForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditDiaryEntryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const entry = await prisma.diaryEntry.findUnique({ where: { id } });
    if (!entry) return notFound();

    const initialData = {
        id: entry.id,
        date: entry.date.toISOString(),
        title: entry.title ?? "",
        theme: entry.theme ?? "",
        readingOne: entry.readingOne,
        readingTwo: entry.readingTwo ?? "",
        readingThree: entry.readingThree ?? "",
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">✏️ Edit Diary Entry</h2>
            <DiaryForm mode="edit" initialData={initialData} />
        </div>
    );
}
