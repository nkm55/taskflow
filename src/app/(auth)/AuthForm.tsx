"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "./actions";

type Props = {
  mode: "login" | "signup";
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
};

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSignup = mode === "signup";

  return (
    <main className="auth">
      <form action={formAction} className="card" noValidate>
        <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">
          {isSignup ? "Start organizing your team's work." : "Log in to your workspace."}
        </p>

        {state.error && (
          <p role="alert" className="alert">
            {state.error}
          </p>
        )}

        {isSignup && (
          <Field
            label="Name"
            name="name"
            autoComplete="name"
            defaultValue={state.values?.name}
            errors={state.fieldErrors?.name}
          />
        )}
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          errors={state.fieldErrors?.email}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          errors={state.fieldErrors?.password}
          hint={isSignup ? "At least 8 characters" : undefined}
        />

        <button type="submit" className="btn primary" disabled={pending}>
          {pending ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
        </button>

        <p className="muted small">
          {isSignup ? (
            <>Already have an account? <Link href="/login">Log in</Link></>
          ) : (
            <>New here? <Link href="/signup">Create an account</Link></>
          )}
        </p>
      </form>
    </main>
  );
}

function Field(props: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  errors?: string[];
  hint?: string;
}) {
  const id = `field-${props.name}`;
  const errorId = `${id}-error`;
  const hasError = !!props.errors?.length;

  return (
    <div className="field">
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        name={props.name}
        type={props.type ?? "text"}
        autoComplete={props.autoComplete}
        defaultValue={props.defaultValue}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        required
      />
      {hasError ? (
        <p id={errorId} className="field-error">
          {props.errors![0]}
        </p>
      ) : (
        props.hint && <p className="muted small">{props.hint}</p>
      )}
    </div>
  );
}
