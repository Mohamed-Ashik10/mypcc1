import DiaryForm from "@/components/DiaryForm";

export default function NewDiaryEntryPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">📝 Add Diary Entry</h2>
            <DiaryForm mode="create" />
        </div>
    );
}
