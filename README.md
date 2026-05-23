# Create new Next.js app
npx create-next-app@latest tg-whiteboard --typescript --tailwind --app --no-src-dir

cd tg-whiteboard

# Clean install - ONLY these packages (no canvas package needed!)
npm install fabric socket.io-client zustand react-colorful lucide-react

# Install type definitions
npm install -D @types/fabric

# Start dev server
npm run dev

mkdir -p components/whiteboard components/toolbar hooks store types utils