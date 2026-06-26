Instructions:
- This project is must be using react typescript with tailwind as tech stack.
- Claude code doesn't start the npm run dev by itself, the developer can initialize the frontend server by himself.
- On each run the same server will be used or same localhost will be used which is http://localhost3000.
- Everytime claude save its memory into .claude folder before ending the session and read the memory from the .claude folder on every session start to know the context we are working on.
The frontend designs will be in the seperate folder and backend integration stuff and logic handling must be in the different folder.
This mailsoul web application would be design in such a way that it work like SaaS product which contain both frontend and backend in the same repo and it must be designed to deploy it on the vercel.
All the secrets should be in the .env.local file and on the deployed version all secrets should be handled in such a way that when I add them to the environment variables of the vercel then the product must be work properly on the deployed version.
Don't use "—" these dashes/slashes in any frontend design.

Design Rules:
Theme: Dark mode SaaS aesthetic, near-black background (#05050a / #0a0a12) with light text.

Color Palette: Background: near-black (#05050a, #0a0a12), default Tailwind dark via --background: #0a0a0a Text: white (headings), zinc-300 / zinc-400 / zinc-500 (body/secondary, in descending emphasis) Primary accent gradient: violet → fuchsia → cyan (from-violet-500/600 via-fuchsia-400/500 to-cyan-300/400) — used on hero headline text, CTA buttons, logo badge, blob backgrounds, hover glows
Borders/surfaces: translucent white (border-white/10, border-white/5, bg-white/5, bg-white/[0.02], bg-white/[0.03]) for glassmorphism cards/navbar with backdrop-blur-xl Status dots: red/yellow/green at 70% opacity (mock browser traffic-light dots) Secondary CTA button: solid white background, black text (high contrast, used in Navbar)

Effects: animate-blob (14s float) and animate-gradient (6s pan) keyframes in globals.css for ambient gradient motion. Heavy use of blur-3xl/blur-2xl for soft glow/mesh backgrounds framer-motion for entrance/hover animations (fade+slide-in, scale on hover/tap)

Shape language: fully rounded (rounded-full for buttons/badges, rounded-2xl/rounded-3xl for cards), no sharp corners.

Since every new page you develop/design its frontend should be ashthetic, modern, creative, awesome. Each screen should be responsive according to each user screen size.