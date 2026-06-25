# Backend

Server-side logic for Mailsoul: channel integrations (Gmail, Outlook, etc. via their developer APIs/OAuth), the RAG pipeline that learns tone/style from the Sent folder, and any data access code.

Next.js API routes under `src/app/api/**` should stay thin and delegate to logic in this folder (`src/backend/integrations`, `src/backend/lib`).
