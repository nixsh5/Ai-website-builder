import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full flex justify-center",
            card: "w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl",
            headerTitle: "text-white text-2xl font-semibold",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton:
              "border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800",
            socialButtonsBlockButtonText: "text-white font-medium",
            dividerLine: "bg-zinc-800",
            dividerText: "text-zinc-500",
            formFieldLabel: "text-zinc-300",
            formFieldInput:
              "rounded-xl border border-zinc-700 bg-black text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-0",
            formButtonPrimary:
              "bg-white text-black hover:bg-zinc-200 rounded-xl font-medium",
            footerActionLink: "text-white hover:text-zinc-300",
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-zinc-400 hover:text-white",
            formResendCodeLink: "text-white hover:text-zinc-300",
          },
        }}
      />
    </div>
  );
}