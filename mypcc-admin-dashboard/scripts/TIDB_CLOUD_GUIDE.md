# Alternative: TiDB Cloud (Free MySQL)

Since Aiven is asking for payment, **TiDB Cloud** is a fantastic alternative that is very easy to set up and completely free for small projects.

### 1. Sign Up
Go to [TiDB Cloud](https://pingcap.com/tidb-cloud) and create a free account.

### 2. Create Cluster
1. Choose **"Serverless"** (this is the free tier).
2. Choose a region (any is fine, but close to you is better).
3. Name your cluster (e.g., `mypcc-admin`).
4. Click **"Create"**.

### 3. Get the Prisma Connection String
1. Once the cluster is created, click **"Connect"**.
2. Select **"Prisma"** from the list of frameworks.
3. It will give you a `DATABASE_URL`.
4. **Copy that URL** and paste it here in the chat.

---

### Why this is good:
- It uses **MySQL** syntax, so we don't need to change any of your code.
- It is extremely fast and reliable.

**If you prefer to use Supabase (PostgreSQL), just let me know!** It is even more popular, but it requires me to change 1 line in your code.
