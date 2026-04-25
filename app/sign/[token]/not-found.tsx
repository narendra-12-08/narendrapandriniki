export default function SignNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-20 sm:py-32">
      <div className="sign-card p-8 sm:p-12 text-center">
        <p className="text-xs uppercase tracking-widest text-[#7d5c3a] font-semibold">
          404
        </p>
        <h1 className="text-3xl font-semibold text-[#111] mt-2">
          Contract not found
        </h1>
        <p className="mt-3 text-[#444] leading-relaxed">
          This signing link is invalid, has expired, or the contract has been
          withdrawn. If you believe this is an error, reply to the original
          email or contact{" "}
          <a href="mailto:hello@narendrapandrinki.com">
            hello@narendrapandrinki.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
