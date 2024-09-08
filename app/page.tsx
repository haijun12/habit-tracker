import Habits from "./ui/Habits";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
// import '@/styles/globals.css'

export default function Home() {
  return (
    <Habits/>

  )
}
