import HymnForm from "@/components/HymnForm";

export default function NewHymnPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">🎵 Add Hymn</h2>
            <HymnForm mode="create" />
        </div>
    );
}
