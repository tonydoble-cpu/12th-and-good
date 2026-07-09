import { Suspense } from "react";
import Container from "@/components/Container";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Container className="py-20 max-w-md">
      <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
        Sign in
      </h1>
      <p className="text-sm text-foreground-secondary mb-8">
        Sign in to book, rebook, and see your session history.
      </p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
