import { createProject } from "./actions";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Create Project</h1>
        <p className="mt-2 text-gray-600">
          Enter your business details to start generating a website.
        </p>

        <form action={createProject} className="mt-8 space-y-6 rounded-xl border p-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Project title
            </label>
            <input
              id="title"
              name="title"
              required
              className="w-full rounded-lg border px-4 py-2"
              placeholder="e.g. FitForge Website"
            />
          </div>

          <div>
            <label htmlFor="businessName" className="mb-2 block text-sm font-medium">
              Business name
            </label>
            <input
              id="businessName"
              name="businessName"
              required
              className="w-full rounded-lg border px-4 py-2"
              placeholder="e.g. FitForge"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium">
              Category / Industry
            </label>
            <input
              id="category"
              name="category"
              required
              className="w-full rounded-lg border px-4 py-2"
              placeholder="e.g. Fitness, Dental Clinic, Bakery"
            />
          </div>

          <div>
            <label htmlFor="services" className="mb-2 block text-sm font-medium">
              Services
            </label>
            <textarea
              id="services"
              name="services"
              required
              rows={4}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="e.g. Personal training, nutrition coaching, online programs"
            />
          </div>

          <div>
            <label htmlFor="targetAudience" className="mb-2 block text-sm font-medium">
              Target audience
            </label>
            <input
              id="targetAudience"
              name="targetAudience"
              required
              className="w-full rounded-lg border px-4 py-2"
              placeholder="e.g. Busy professionals aged 25–40"
            />
          </div>

          <div>
            <label htmlFor="tone" className="mb-2 block text-sm font-medium">
              Preferred tone / style
            </label>
            <input
              id="tone"
              name="tone"
              required
              className="w-full rounded-lg border px-4 py-2"
              placeholder="e.g. Modern, friendly, premium"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </main>
  );
}