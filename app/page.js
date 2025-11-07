import Image from "next/image";
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/create-user');
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Home Page 
    </div>
  );
}
