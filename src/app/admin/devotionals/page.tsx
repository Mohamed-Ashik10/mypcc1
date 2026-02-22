import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DevotionalsPage() {
    const devotionals = await prisma.devotional.findMany({ orderBy: { date: "desc" }, take: 50 });

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">🙏 Devotionals</h2>
                <p className="text-muted-foreground mt-1">{devotionals.length} devotionals</p>
            </div>

            {devotionals.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">🙏</p>
                    <p className="text-muted-foreground text-lg">No devotionals published yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {devotionals.map((d) => (
                        <div key={d.id} className="bg-card text-card-foreground rounded-2xl shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-foreground">{d.title}</h3>
                                    <p className="text-sm text-muted-foreground/60 mt-1">
                                        {new Date(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                                        {d.author && <> · By <span className="text-muted-foreground">{d.author}</span></>}
                                    </p>
                                    <p className="text-muted-foreground mt-3 text-sm line-clamp-3">{d.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
