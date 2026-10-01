"use server";

import { redirect } from "next/navigation";

import { createServerClient } from "@/lib/supabase-server-auth";
import { getOrCreateProfile } from "@/lib/getProfile";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Email and password are required");
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const profile = await getOrCreateProfile();
  redirect(profile?.onboardingCompleted ? "/dashboard" : "/onboarding");
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/forgot-password?error=Email is required");

  const supabase = await createServerClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/update-password`
  });

  if (error) redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  redirect("/forgot-password?message=Check your email for a password reset link");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < 6) redirect("/update-password?error=Password must be at least 6 characters");
  if (password !== confirmation) redirect("/update-password?error=Passwords do not match");

  const supabase = await createServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect(`/update-password?error=${encodeURIComponent(error.message)}`);
  redirect("/login?message=Your password has been updated");
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const acceptedTerms = formData.get("acceptedTerms") === "on";

  if (!email || !password) {
    redirect("/signup?error=Email and password are required");
  }
  if (!acceptedTerms) redirect("/signup?error=Please review and accept the Terms of Service and Privacy Policy");

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user && !data.session) {
    redirect("/login?message=Check your email to confirm your account");
  }

  redirect("/onboarding");
}

export async function completeOnboarding(formData: FormData) {
  const ministryName = String(formData.get("ministryName") ?? "").trim().slice(0, 120);
  const firstAction = String(formData.get("firstAction") ?? "dashboard");
  const profile = await getOrCreateProfile();
  if (!profile?.organizationId) redirect("/login?error=Your account is not assigned to an organization");
  if (ministryName.length < 2) redirect("/onboarding?error=Enter your church or ministry name");

  const { error } = await supabaseAdmin
    .from("organizations")
    .update({ name: ministryName })
    .eq("id", profile.organizationId);
  if (error) redirect("/onboarding?error=Could not save your ministry details");

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", profile.user.id);
  if (profileError) redirect("/onboarding?error=Could not finish onboarding");

  const destinations: Record<string, string> = {
    sermon: "/sermons/new",
    worship: "/worship-plans/new",
    discipleship: "/discipleship-plans/new",
    dashboard: "/dashboard"
  };
  redirect(destinations[firstAction] || "/dashboard");
}

export async function logout() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
