import HymnForm from "@/components/HymnForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditHymnPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const hymn = await prisma.hymn.findUnique({ where: { id } });
    if (!hymn) return notFound();

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">✏️ Edit Hymn #{hymn.number}</h2>
            <HymnForm
                mode="edit"
                initialData={{
                    id: hymn.id,
                    number: String(hymn.number),
                    title: hymn.title,
                    lyrics: hymn.lyrics,
                }}
            />
        </div>
    );
}
