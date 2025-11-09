// app/todos/[slug]/page.js (SERVER COMPONENT)
import TodoClient from "./todoClient";

export default async function Page({ params }) {
  const { slug } = await params;
  const id = slug.replace("todo-", "");

  const baseURL =
    process.env.APP_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseURL}/api/todo/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!data.success) {
    return (
      <div className="w-full text-center mt-20 text-neutral-700">
        Todo not found.
      </div>
    );
  }

  return <TodoClient todo={data.todo} />;
}
