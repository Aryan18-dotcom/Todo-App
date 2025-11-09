// app/todos/[slug]/page.js  ✅ SERVER COMPONENT
import TodoClient from "./todoClient";

export default async function Page({ params }) {
  const { slug } = await params; // ✅ params is now defined
  const id = slug.replace("todo-", "");

  const res = await fetch(`http://localhost:3000/api/todo/${id}`, {
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
