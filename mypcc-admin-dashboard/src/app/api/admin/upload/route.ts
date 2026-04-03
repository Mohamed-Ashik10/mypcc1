import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Ensure filename is safe
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const filename = `${Date.now()}_${safeName}`;
        
        // Define directory: public/uploads
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        
        // Create directory if it doesn't exist
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (dirError) {
            console.log("Uploads directory exists or cannot be created", dirError);
        }
        
        // Write the physical file
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);
        
        // Return the local URL
        return NextResponse.json({ url: `/uploads/${filename}` });
        
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message || "Failed to parse file upload" }, { status: 500 });
    }
}
