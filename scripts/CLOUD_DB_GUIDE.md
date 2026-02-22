# How to Get Your Cloud MySQL URI (Free)

Follow these steps to set up a database that works with Vercel:

### 1. Sign Up
Go to [Aiven.io](https://aiven.io/) and create a free account.

### 2. Create Service
1. Click **"Create Service"**.
2. Select **MySQL**.
3. Choose the **Free Plan** (look for the "Free" badge).
4. Choose a region close to you (e.g., London, Frankfurt, or Oregon).
5. Give it a name like `mypcc-db`.
6. Click **"Create Service"**.

### 3. Get the URI
1. Wait about 3-5 minutes for the status to change from "Rebuilding" to **"Running"**.
2. Scroll down to the **"Connection information"** section.
3. Look for **"Service URI"**.
4. It will look something like this:
   `mysql://avnadmin:password123@mysql-mypcc-db.aivencloud.com:12345/defaultdb`
5. **Copy this URI** and paste it here in the chat.

---

### Security Note
- Leave **"SSL Mode"** as the default.
- You can turn off **"Require SSL"** in the Aiven settings if Prisma has trouble connecting initially, though Prisma usually handles it fine.

**Once you send me that link, I will handle the rest!**
